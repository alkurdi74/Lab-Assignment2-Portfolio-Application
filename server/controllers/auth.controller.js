import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import config from '../../config/config.js';
export async function requireSignin(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  let claims;
  try { claims = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'], issuer: 'portfolio-api', audience: 'portfolio-client' }); }
  catch { return res.status(401).json({ error: 'A valid sign-in token is required.' }); }
  const user = await User.findById(claims.sub).select('+sessionVersion');
  if (!user || user.sessionVersion !== claims.version) return res.status(401).json({ error: 'Session expired. Sign in again.' });
  req.auth = user;
  next();
}
export async function signin(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Email and password are required.' });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +sessionVersion');
  if (!user || !user.authenticate(password)) return res.status(401).json({ error: 'Invalid email or password.' });
  const token = jwt.sign({ version: user.sessionVersion }, config.jwtSecret, { subject: user.id, expiresIn: '1h', algorithm: 'HS256', issuer: 'portfolio-api', audience: 'portfolio-client' });
  res.json({ token, user });
}
export async function signout(req, res) {
  await User.updateOne({ _id: req.auth._id }, { $inc: { sessionVersion: 1 } });
  res.json({ message: 'Signed out successfully. All tokens for this user are revoked.' });
}
