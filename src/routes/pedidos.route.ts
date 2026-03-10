// src/routes/pedidos.route.ts
// Adicione essa rota no seu servidor Express/Fastify do backend Promoforia

import { Router, Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';

const router = Router();

// ─── Conexão ──────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB  = process.env.MONGODB_DB!;

let db: Db;

async function getDb(): Promise<Db> {
  if (db) return db;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(MONGODB_DB);
  return db;
}

// ─── Validação ────────────────────────────────────────────────────────────────

function validatePedido(body: any): string | null {
  if (!body.nome?.trim())                        return 'Nome é obrigatório';
  if (!body.telefone?.trim())                    return 'Telefone é obrigatório';
  if (body.telefone.replace(/\D/g, '').length < 10) return 'Telefone inválido';
  if (!body.pedidos?.trim())                     return 'Pedido é obrigatório';
  return null;
}

// ─── POST /api/pedidos ────────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  const validationError = validatePedido(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

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

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: { id: result.insertedId },
    });
  } catch (err) {
    console.error('[pedidos] Erro ao inserir:', err);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// ─── GET /api/pedidos ─────────────────────────────────────────────────────────

router.get('/', async (_req: Request, res: Response) => {
  try {
    const database = await getDb();
    const docs = await database
      .collection('pedidos')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({ success: true, data: docs });
  } catch (err) {
    console.error('[pedidos] Erro ao buscar:', err);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

export default router;