import { Channel } from 'amqplib';
import dotenv from 'dotenv';
import path from 'path';
import { Worker } from 'worker_threads';

dotenv.config();

const { TRANSACTION_START_QUEUE, TRANSACTION_COMPLETED_QUEUE } = process.env;

export class TransactionQueue {
  private static channel: Channel;

  public static async receive(channel: Channel) {
    try {
      TransactionQueue.channel = channel;

      channel.assertQueue(TRANSACTION_START_QUEUE!, { durable: true });

      channel.consume(TRANSACTION_START_QUEUE!, (message: any) => {
        const messageData = JSON.parse(message.content.toString());

        new Worker(path.join(__dirname, '../workers/transactionWorker.js'), {
          workerData: { transaction: messageData },
        })
          .on('message', (data: any) => {
            console.log('TransactionWorker ~ onMessage ~ data', data);
            TransactionQueue.send(data);
          })
          .on('error', (error: any) => {
            console.error('TransactionWorker ~ onError ~ error', error);
          });
      },
        { noAck: true }
      );
    } catch (error) {
      console.log('Error receiving message', error);
    }
  }


  public static send(message: Record<string, any>) {
    TransactionQueue.channel.assertQueue(TRANSACTION_COMPLETED_QUEUE!);
    TransactionQueue.channel.sendToQueue(TRANSACTION_COMPLETED_QUEUE!, Buffer.from(JSON.stringify(message)));
  }
}
