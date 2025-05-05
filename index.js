import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();



const db = mysql2.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

//dapet semua data user
  export async function getUser() {
    const [rows] = await db.query('SELECT * FROM user');
    return rows;
  };
//dapet data user berdasarkan id
 export async function getUserById(id) {
    const [rows] = await db.query('SELECT * FROM user WHERE user_id = ?', [id]);
    return rows;
  };
//input data ke table user
  export async function createUser(user) {
    const [result] = await db.query('INSERT INTO user (username, password, email, avatar) VALUES (?, ?, ?, ?)', [user.username, user.password, user.email, user.avatar]);
    return getUserById(result.insertId);
  };
//update data user
  export async function updateUserById(id, arraykey, arrayvalue) {
    const [updateResult] = await db.query(`UPDATE user SET ${arraykey.join(", ")} WHERE user_id = ?`, arrayvalue);
    return getUserById(id);
  };
//hapus data user
  export async function deleteUser(id) {
    const [result] = await db.query('DELETE FROM user WHERE user_id = ?', [id]);
    return result.affectedRows > 0;
  };