import express from 'express';
import { getUser, getUserById, getUserByUsername, getUserByEmail, createUser, updateUserById, deleteUser, getFilmQuery, verifyEmailByToken } from './index.js';
import tokenVerify from './authentication.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import sendEmail from './mailerAuth.js';
import multer from 'multer';

const router = express.Router();

//dapet semua data user
router.get('/user', async (req, res) => {
  try {
    const users = await getUser();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//dapet data user berdasarkan id
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//input data ke table user
router.post('/user/register', async (req, res) => {
  const { username, password, email, avatar } = req.body;


  
    const saltRounds = 10;
    const userPassword = password;
    const hasher = await bcrypt.hash(userPassword, saltRounds);
    
    const verify_token = uuidv4();
  try {
    
    const newUser = await createUser({ username, hasher, email, avatar, verify_token });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//update data user
router.put('/user/update/:id', async (req, res) => {
  const id = req.params.id;
  const objectBody = req.body;
  const arraykey = [];
  const arrayvalue = [];
  if (Object.keys(objectBody).length === 0) {
    return res.status(400).json({ error: 'Bad Request' });
  }
  for (const [key, value] of Object.entries(objectBody)) {
    arraykey.push(`${key}`+' = ?');
    arrayvalue.push(value);
  }

  arrayvalue.push(id);

  try {
    const updatedUser = await updateUserById(id, arraykey, arrayvalue);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//update data user yang spesifik
router.patch('/user/update/:id', async (req, res) => {
  const id = req.params.id;
  const objectBody = req.body;
  const arraykey = [];
  const arrayvalue = [];

  if (Object.keys(objectBody).length === 0) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  if ('password' in objectBody) {
    const saltRounds = 10;
    const userPassword = objectBody.password;
    const hasher = await bcrypt.hash(userPassword, saltRounds);
    objectBody.password = hasher;
  }

  for (const [key, value] of Object.entries(objectBody)) {
    arraykey.push(`${key}`+' = ?');
    arrayvalue.push(value);
  }

  arrayvalue.push(id);

  try {
    const updatedUser = await updateUserById(id, arraykey, arrayvalue);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//hapus data user
router.delete('/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await deleteUser(id);
    if (result) {
      res.send('success: User deleted successfully');
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//login
router.post('/user/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [ user ] = await getUserByUsername(username);
    console.log(user);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(user, 'database_sheehan', { expiresIn: '1h' });
    res.json({ 
      message: 'Login successful',
      status_token: 'Created successfully',
      token: token
     });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//profile
router.get('/user/login/profile', tokenVerify, async (req, res) => {
  const id = req.user.user_id;
  try {
    const [user] = await getUserById(id);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
    res.send('success: User profile retrieved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//request verify
router.get('/user/login/request-verify', tokenVerify, async (req, res) => {
  const { email } = req.query;
  if (email) {
    const [user] = await getUserByEmail(email);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.already_verify === 1)
    {
      return res.status(400).json({ error: 'user already verified'})
    }

    const { verify_token } = user;
    console.log(verify_token);
    if (!verify_token) {
      return res.status(400).json({ error: 'Token not found' });
    }

    // Send the verification email
    const result = await sendEmail(email, verify_token);

    res.status(200).json({ message: 'Token found', email: email, token: verify_token, email_send: result ? `success` : `failed` });

  }
}
);

//verify-email
router.get('/user/login/verify-email', tokenVerify, async (req, res) => {
  
  const { email, token } = req.query;
  if (token && email) {
    const result = await verifyEmailByToken( { email, token } );
    if (result) {
      res.status(200).json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid token or email' });
    }
  }

});

//fitur query params

router.get('/user/lobby/movie', tokenVerify, async (req, res) => {
  const {genre, contains, orderByAsc} = req.query;

  let queryString = '';
  const params = [];

    if (genre) {
      queryString += ' where genre_id = ?';
      params.push(genre);
    }

    if (contains) {
      queryString += genre ? ' and name like ?' : ' where name like ?';
      params.push(`%${contains}%`);
    }

    if (orderByAsc === 'true') {
      queryString += ' order by name asc';
    }
    else if (orderByAsc === 'false') {
      queryString += ' order by name desc';
    }


  try {
    console.log(queryString);
      const queriesOutput = await getFilmQuery(queryString, params);
      res.json(queriesOutput);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  
  
});

//upload image
router.post('/user/login/upload', tokenVerify, async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage }).single('image');

  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }
    res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
  });
}
);
export default router;