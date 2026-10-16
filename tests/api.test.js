import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { randomBytes } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
process.env.JWT_SECRET = randomBytes(48).toString('hex');
const { default: app } = await import('../server/express.js');
const { default: User } = await import('../server/models/user.model.js');
const evidence = [];
const dbName = 'Portfolio_test_' + Date.now();
let token, account;
async function call(method, url, body, status, auth = token) {
  let req = request(app)[method](url);
  if (auth) req = req.set('Authorization', 'Bearer ' + auth);
  if (body !== undefined) req = req.send(body);
  const res = await req;
  const safeBody = body ? { ...body } : undefined;
  if (safeBody?.password) safeBody.password = '[redacted]';
  const safeResult = { ...res.body };
  if (safeResult.token) safeResult.token = '[JWT redacted]';
  evidence.push({ method: method.toUpperCase(), url, request: safeBody, expected: status, actual: res.status, response: Array.isArray(res.body) ? res.body : safeResult });
  assert.equal(res.status, status, JSON.stringify(res.body));
  return res.body;
}
before(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017', { dbName, serverSelectionTimeoutMS: 5000 });
  await Promise.all(Object.values(mongoose.models).map(m => m.init()));
});
after(async () => {
  await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
  await writeFile(new URL('../evidence/api-results.json', import.meta.url), JSON.stringify({ timestamp: new Date().toISOString(), database: dbName, evidence }, null, 2));
  if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
test('all CRUD endpoints, validation, passwords and authentication', async () => {
  assert.equal((await call('get', '/', undefined, 200, null)).message, 'Welcome to My Portfolio application.');
  account = await call('post', '/api/users', { name: 'API Tester', email: 'tester@example.com', password: 'Testing123!' }, 201, null);
  assert.equal(account.password, undefined);
  await call('post', '/auth/signin', { email: 'tester@example.com', password: 'wrong' }, 401, null);
  token = (await call('post', '/auth/signin', { email: 'tester@example.com', password: 'Testing123!' }, 200, null)).token;
  await call('post', '/api/users', { name: 'Duplicate', email: 'tester@example.com', password: 'Testing123!' }, 409);
  for (const resource of ['contacts', 'projects', 'qualifications', 'users']) {
    const base = '/api/' + resource;
    const body = resource === 'users' ? { name: 'Example User', email: 'example@example.com', password: 'Example123!' } : { firstname: 'Example', lastname: 'Student', email: 'example@example.com', ...(resource !== 'contacts' ? { title: 'Example Portfolio Entry', completion: '2026-09-28', description: 'Assignment API test record' } : {}) };
    if (resource !== 'users' && resource !== 'contacts') await call('post', base, body, 401, null);
    await call('put', base + '/507f1f77bcf86cd799439011', body, 401, null);
    await call('delete', base, undefined, 401, null);
    const created = await call('post', base, body, 201);
    assert.ok(created._id);
    assert.ok((await call('get', base, undefined, 200)).some(x => x._id === created._id));
    assert.equal((await call('get', base + '/' + created._id, undefined, 200)).email, body.email);
    const update = resource === 'users' ? { name: 'Updated User' } : resource === 'contacts' ? { firstname: 'Updated' } : { title: 'Updated Entry' };
    const updated = await call('put', base + '/' + created._id, update, 200);
    for (const key of Object.keys(update)) assert.equal(updated[key], update[key]);
    await call('put', base + '/' + created._id, { email: 'invalid' }, 400);
    await call('post', base, {}, 400);
    await call('post', base, { ...body, unexpected: 'value' }, 400);
    await call('get', base + '/invalid', undefined, 400);
    await call('get', base + '/507f1f77bcf86cd799439011', undefined, 404);
    if (resource === 'users') {
      const stored = await User.findById(created._id).select('+password');
      assert.notEqual(stored.password, body.password);
      assert.ok(stored.authenticate(body.password));
      const otherToken = (await call('post', '/auth/signin', { email: body.email, password: body.password }, 200)).token;
      await call('put', base + '/' + created._id, { password: 'Changed123!' }, 200);
      await call('get', base, undefined, 401, otherToken);
      await call('post', '/auth/signin', { email: body.email, password: body.password }, 401);
      await call('post', '/auth/signin', { email: body.email, password: 'Changed123!' }, 200);
    }
    await call('delete', base + '/' + created._id, undefined, 200);
    await call('get', base + '/' + created._id, undefined, 404);
    if (resource !== 'users') {
      await call('post', base, body, 201);
      assert.equal((await call('delete', base, undefined, 200)).deletedCount, 1);
      assert.deepEqual(await call('get', base, undefined, 200), []);
    }
  }
  await call('post', '/auth/signout', undefined, 200);
  await call('get', '/api/users', undefined, 401);
  token = (await call('post', '/auth/signin', { email: 'tester@example.com', password: 'Testing123!' }, 200, null)).token;
  assert.equal((await call('delete', '/api/users', undefined, 200)).deletedCount, 1);
  await call('get', '/api/users', undefined, 401);
  await call('get', '/missing', undefined, 404, null);
  console.log(evidence.length + ' HTTP requests verified against real MongoDB.');
});
