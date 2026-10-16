import mongoose from 'mongoose';
export function crud(Model, fields) {
  function body(req) {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw Object.assign(new Error('A JSON object is required.'), { status: 400 });
    const keys = Object.keys(req.body);
    if (!keys.length || keys.some(key => !fields.includes(key))) throw Object.assign(new Error('Provide only these fields: ' + fields.join(', ')), { status: 400 });
    for (const key of keys) if (typeof req.body[key] !== 'string') throw Object.assign(new Error(key + ' must be a string.'), { status: 400 });
    return req.body;
  }
  async function record(req) {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) throw Object.assign(new Error('Invalid record ID.'), { status: 400 });
    const query = Model.findById(req.params.id);
    if (Model.modelName === 'User') query.select('+sessionVersion');
    const doc = await query;
    if (!doc) throw Object.assign(new Error('Record not found.'), { status: 404 });
    return doc;
  }
  return {
    list: async (_req, res) => res.json(await Model.find().sort({ _id: 1 })),
    read: async (req, res) => res.json(await record(req)),
    create: async (req, res) => res.status(201).json(await Model.create(body(req))),
    update: async (req, res) => { const doc = await record(req); Object.assign(doc, body(req)); await doc.save(); res.json(doc); },
    remove: async (req, res) => { const doc = await record(req); await doc.deleteOne(); res.json({ message: 'Record deleted successfully.' }); },
    removeAll: async (_req, res) => { const result = await Model.deleteMany({}); res.json({ message: 'All records deleted successfully.', deletedCount: result.deletedCount }); }
  };
}
