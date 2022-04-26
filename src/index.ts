import amqp from 'amqplib';
import dotenv from 'dotenv';
import { TransactionQueue } from './services/transactionQueue';

dotenv.config();

const { RABBITMQ_URL } = process.env;

amqp
  .connect(RABBITMQ_URL!)
  .then(async (connection) => {
    console.log('Connected to RabbitMQ');
    const channel = await connection.createChannel();

    await TransactionQueue.receive(channel);
  })
  .catch((error) => {
    console.log('Error connection to RabbitMQ', error);
  });
