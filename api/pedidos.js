// api/pedidos.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB  = process.env.MONGODB_DB;

let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedDb = client.db(MONGODB_DB);
  return cachedDb;
}

function validatePedido(body) {
  if (!body.nome?.trim())                            return 'Nome é obrigatório';
  if (!body.telefone?.trim())                        return 'Telefone é obrigatório';
  if (body.telefone.replace(/\D/g, '').length < 10) return 'Telefone inválido';
  if (!body.pedidos?.trim())                         return 'Pedido é obrigatório';
  return null;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDb();

    // POST — criar pedido
    if (req.method === 'POST') {
      const err = validatePedido(req.body);
      if (err) return res.status(400).json({ success: false, message: err });

      const now = new Date();
      const result = await db.collection('pedidos').insertOne({
        nome:      req.body.nome.trim(),
        telefone:  req.body.telefone.trim(),
        pedidos:   req.body.pedidos.trim(),
        createdAt: now,
        updatedAt: now,
      });

      return res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: { id: result.insertedId },
      });
    }

    // GET — listar pedidos
    if (req.method === 'GET') {
      const docs = await db
        .collection('pedidos')
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      return res.json({ success: true, data: docs });
    }

    return res.status(405).json({ success: false, message: 'Método não permitido' });

  } catch (e) {
    console.error('❌ [pedidos]', e);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}