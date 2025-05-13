import express from 'express';
import cors from 'cors';
import router from './route.js'
import jwt from 'jsonwebtoken';





const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', router);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);


// const user = {
//     "user_id": 1,
//     "username": "sheehan",
//     "password": "akusayangmami321",
//     "email": "sheehanandya001@gmail.com",
//     "avatar": "godzilabro"
// }
// const secretKey = 'your_secret_key';
// const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
// console.log('Generated JWT:', token);
// const decoded = jwt.verify(token, secretKey);
// console.log('Decoded JWT:', decoded);


// const bodies =
//   { name: 'John', 
//     age: 30,
//     address: { city: 'New York', zip: '10001' },
//     hobbies: ['reading', 'traveling'],
//     isActive: true
//    };

// const arraykey = [];
// const arrayvalue = [];

// for (const [key, value] of Object.entries(bodies)) {
//   arraykey.push(key);
//   arrayvalue.push(value);
// }

// console.log(arraykey);
// console.log(arrayvalue);