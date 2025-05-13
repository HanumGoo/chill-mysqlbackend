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
//dapet data user berdasarkan username
  export async function getUserByUsername(username) {
    const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
    return rows;
  };
//dapet data user berdasarkan email
  export async function getUserByEmail(email) {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return rows;
  };
//input data ke table user
  export async function createUser(user) {
    const [result] = await db.query('INSERT INTO user (username, password, email, avatar, verify_token) VALUES (?, ?, ?, ?, ?)', [user.username, user.hasher, user.email, user.avatar, user.verify_token]);
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

//=========================================================

//dapet semua data film
export async function getFilm() {
  const [rows] = await db.query('SELECT * FROM episode_movie');
  return rows;
};
//dapet film berdasarkan genre
export async function getFilmByGenreId(genre) {
  const [rows] = await db.query('SELECT * FROM episode_movie WHERE genre_id = ?', [genre]);
  return rows;
};
//dapet film berdasarkan id film
export async function getFilmById(id) {
  const [rows] = await db.query('SELECT * FROM episode_movie WHERE epsmov_id = ?', [id]);
  return rows;
};
//sort semua film berdasarkan abjad
export async function getFilmSort() {
  const [rows] = await db.query('SELECT * FROM episode_movie ORDER BY title ASC');
  return rows;
};
//search semua film berdasarkan title(contains)
export async function getFilmSearch(title) {
  const [rows] = await db.query('SELECT * FROM episode_movie WHERE title LIKE ?', [`%${title}%`]);
  return rows;
};
//function untuk nerima query params
export async function getFilmQuery(query, params) {
  const [rows] = await db.query(`SELECT * FROM episode_movie${query}`, params);
  return rows;
};

//=========================================================
//verification token

export async function verifyEmailByToken(data) {
  const [rows] = await db.query('SELECT * FROM user WHERE email = ? and verify_token = ?', [data.email, data.token]);
  if (rows.length === 0) {
    
    return false;
  }
  else {
    const [updateResult] = await db.query('UPDATE user SET already_verify = true WHERE email = ? and verify_token = ?', [data.email, data.token]);
    return true;
  }
  
}

