import dotenv from 'dotenv';
import {parentPort, workerData} from 'worker_threads';

dotenv.config();

class TransactionWorker {
  static charge() {
    setTimeout(() => {
      console.log('TransactionWorker ~ charging: ', workerData);
      workerData.transaction.status = 'success';
      parentPort?.postMessage(workerData.transaction);
    }, 100);
  }
}

TransactionWorker.charge();
