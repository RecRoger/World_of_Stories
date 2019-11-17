import mongoose from 'mongoose';
import { mongodb } from './keys';

mongoose.connect(mongodb.URI, {
    useNewUrlParser: true
})
.then((db: any) => {
    console.log('-------------------');
    console.log('DB is Connected!!');
    console.log('-------------------');
})
.catch((err: any) => console.log(err));