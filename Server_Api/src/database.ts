import mongoose from 'mongoose';
import { mongoKeys } from './keys';

mongoose.connect(mongoKeys.URI, {
    useNewUrlParser: true
})
.then((db: any) => {
    console.log('-------------------');
    console.log('DB is Connected!!');
    console.log('-------------------');
})
.catch((err: any) => console.log(err));