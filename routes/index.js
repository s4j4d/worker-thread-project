import express from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import multer from 'multer';
import { Worker, isMainThread } from 'node:worker_threads';
import * as dotenv from 'dotenv';

dotenv.config();

const storage = multer.diskStorage({
  destination: './uploads',
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({ dest: 'uploads', storage });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(process.cwd(), '/views'));
app.set('view engine', 'hbs');
// eslint-disable-next-line no-unused-vars
app.post('/upload-video', upload.single('ssvideo'), (req, res) => {
  // console.log(req.file);
  const imageUrl = '.download.jpg';
  let thread;
  if (isMainThread) {
    thread = new Worker('./threads/threaderone.js', {
      workerData: {
        file: req.file.path,
        filename: req.file.filename,
        watermark_image_url: imageUrl,
      },
    });
  }
  thread.on('message', (data) => {
    res.download(data.file, req.file.filename);
  });

  thread.on('error', (err) => {
    console.error('thread', err);
  });

  thread.on('exit', (code) => {
    if (code != 0) console.error(`Worker stopped with exit code ${code}`);
  });
});
app.get('/', (req, res) => {
  res.render('index');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port${port}`);
});
