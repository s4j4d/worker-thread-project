import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import multer from 'multer';

require('dotenv').config();

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

app.use('view', path.join(__dirname, '/views'));
app.use('view engine', 'hbs');
// eslint-disable-next-line no-unused-vars
app.post('/upload-video', upload.single('ssvideo'), (req, res) => {
  console.log(req.file);
});
app.get('/', (req, res) => {
  res.render('index');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port${port}`);
});


