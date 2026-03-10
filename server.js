// server.js  (raiz do projeto VANT-PEDIDOS)
import 'dotenv/config';
import express    from 'express';
import cors       from 'cors';
import { MongoClient } from 'mongodb';

const app  = express();
const PORT = process.env.PORT || 4000;

// ─── MongoDB ──────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB  = process.env.MONGODB_DB;

if (!MONGODB_URI) throw new Error('MONGODB_URI não definida no .env');
if (!MONGODB_DB)  throw new Error('MONGODB_DB não definida no .env');

let db;

async function getDb() {
  if (db) return db;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(MONGODB_DB);
  console.log(`✅ MongoDB conectado: ${MONGODB_DB}`);
  return db;
}

// ─── Middlewares ──────────────────────────────────────────────────────────────

app.use(cors({
  origin: (origin, callback) => {
    // Permite localhost em qualquer porta, Vercel e ngrok
    if (
      !origin ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.ngrok(-free)?\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ─── Validação ────────────────────────────────────────────────────────────────

function validatePedido(body) {
  if (!body.nome?.trim())                            return 'Nome é obrigatório';
  if (!body.telefone?.trim())                        return 'Telefone é obrigatório';
  if (body.telefone.replace(/\D/g, '').length < 10) return 'Telefone inválido';
  if (!body.pedidos?.trim())                         return 'Pedido é obrigatório';
  return null;
}

// ─── Rotas ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'OK' }));

// POST /api/pedidos — criar pedido
app.post('/api/pedidos', async (req, res) => {
  const err = validatePedido(req.body);
  if (err) return res.status(400).json({ success: false, message: err });

  try {
    const database = await getDb();
    const now = new Date();

    const result = await database.collection('pedidos').insertOne({
      nome:      req.body.nome.trim(),
      telefone:  req.body.telefone.trim(),
      pedidos:   req.body.pedidos.trim(),
      createdAt: now,
      updatedAt: now,
    });

    console.log(`📦 [pedidos] Novo pedido: ${result.insertedId}`);

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: { id: result.insertedId },
    });
  } catch (e) {
    console.error('❌ [pedidos] Erro:', e);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// GET /api/pedidos — listar pedidos
app.get('/api/pedidos', async (_req, res) => {
  try {
    const database = await getDb();
    const docs = await database
      .collection('pedidos')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({ success: true, data: docs });
  } catch (e) {
    console.error('❌ [pedidos] Erro:', e);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
  await getDb();
  console.log(`🚀 VANT-PEDIDOS API rodando na porta ${PORT}`);
});