import mongoose from 'mongoose';
import config from './config/config.js';
import app from './server/express.js';
try {
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
  await Promise.all(Object.values(mongoose.models).map(Model => Model.init()));
  console.log('Connected to MongoDB database: ' + mongoose.connection.name);
  const server = app.listen(config.port, () => console.log('Server running at http://localhost:' + config.port + '/'));
  server.on('error', async err => { console.error(err.message); await mongoose.disconnect(); process.exitCode = 1; });
  async function shutdown() { server.close(async () => { await mongoose.disconnect(); process.exit(0); }); }
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch (err) { console.error('Server startup failed: ' + err.message); process.exitCode = 1; }
