import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
require('dotenv').config();
import route from './server/routes/index';
import config from './server/config';
import Logger from 'logger-nodejs';
const log = new Logger();

const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

import './server/models/Cashe';

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
try {
    mongoose.connect(config.mongoConnectionString, { 
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
}catch(error) {
 log.info(error)
}

app.use('/api/v1', route);
app.use('*', (req, res) => res.status(404).json('Not Found'));
app.listen(process.env.PORT || '5000', () => {
    log.info('server is running');
});

export default app;