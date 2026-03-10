// src/lib/pedidos.service.ts
// Em produção (Vercel): VITE_API_URL fica vazio → chama /api/pedidos relativo
// Em dev local: VITE_API_URL=http://localhost:4000

const API_URL = (import.meta.env.VITE_API_URL as string) || '';

export interface PedidoInput {
  nome: string;
  telefone: string;
  pedidos: string;
}

export interface PedidoResponse {
  success: boolean;
  message: string;
  data?: { id: string };
}

export const pedidosService = {
  async insert(input: PedidoInput): Promise<void> {
    const res = await fetch(`${API_URL}/api/pedidos`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(input),
    });

    const json: PedidoResponse = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || `Erro HTTP ${res.status}`);
    }
  },
};