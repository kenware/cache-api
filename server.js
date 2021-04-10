import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

require('dotenv').config();

const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.listen(process.env.PORT || '5000', () => {
  console.log('server is running');
});