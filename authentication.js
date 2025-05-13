import jwt from 'jsonwebtoken';

export function tokenVerify(req, res, next) {
  const token = req.headers['authorization'];

  const bearer = token && token.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(bearer, 'database_sheehan', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded;
    next();
  });
}

export default tokenVerify;
