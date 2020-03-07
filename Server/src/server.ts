import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
// import mongoose from 'mongoose';

import { sessionRouter } from './routes/session';

const app: express.Application = express();
const PORT = 443;

app.set('json spaces', 2);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/session', sessionRouter);

//connect()
listen();

function listen() {
    app.listen(PORT);
    console.log('App started on port ' + PORT);
}

// function connect() {
//     mongoose.set('useFindAndModify', false);
//     mongoose.set('useCreateIndex', true);
//     mongoose.connection
//         .on('error', console.error)
//         .on('disconnected', connect)
//         .once('open', listen);
//     return mongoose.connect('mongodb:/localhost:27017/doppler', {
//         keepAlive: 1,
//         useNewUrlParser: true,
//     });
// }
