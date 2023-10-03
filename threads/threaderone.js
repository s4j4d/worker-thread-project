import * as FFmpeg from 'ffmpeg';

import { workerData, parentPort } from 'node:worker_threads';

try {
  const process = new FFmpeg(workerData.file);

  process.then((video) => {
    video.fnAddWatermark(
      `${__dirname}/download.jpg`,
      `${__dirname}/${workerData.filename}`,
      {
        position: 'C',
      },
      (err, file) => {
        if (!err) {
          console.log(`New video file is${file}`);

          parentPort.postMessage({ status: 'Done', file });
        }
      },
    );
  });
} catch (e) {
  console.log(e.code);
  console.log(e.msg);
}
