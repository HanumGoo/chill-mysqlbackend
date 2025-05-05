import express from 'express';
import { getUser, getUserById, createUser, updateUserById, deleteUser } from './index.js';


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
router.post('/user', async (req, res) => {
  const { username, password, email, avatar } = req.body;
  try {
    const newUser = await createUser({ username, password, email, avatar });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//update data user
router.put('/user/:id', async (req, res) => {
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
router.patch('/user/:id', async (req, res) => {
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
export default router;