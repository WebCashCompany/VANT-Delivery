import { useState } from 'react';
import { Send } from 'lucide-react';
import { pedidosService } from './lib/pedidos.service';
import logo from './assets/logo.png';

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    pedidos: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, telefone: formatPhoneNumber(e.target.value) });
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Por favor, preencha seu nome');
      return false;
    }
    if (!formData.telefone.trim() || formData.telefone.length < 14) {
      setError('Por favor, preencha seu telefone com formato válido');
      return false;
    }
    if (!formData.pedidos.trim()) {
      setError('Por favor, descreva seu pedido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await pedidosService.insert({
        nome:     formData.nome.trim(),
        telefone: formData.telefone,
        pedidos:  formData.pedidos.trim(),
      });

      setSuccess(true);
      setFormData({ nome: '', telefone: '', pedidos: '' });
    } catch (err: any) {
      console.error('Erro ao enviar pedido:', err);
      setError(err.message || 'Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = () => {
    setSuccess(false);
    setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-flex">
            <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Pedido Enviado!</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Seu pedido foi enviado com sucesso! Em breve entraremos em contato pelo WhatsApp.
          </p>
          <button
            onClick={handleNewOrder}
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Enviar Outro Pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="VANT Logo" className="h-24 w-auto drop-shadow-lg" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">VANT - Pedidos</h1>
          <p className="text-gray-300 text-sm">Preencha o formulário abaixo para solicitar seu pedido.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-200 mb-2">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-200 mb-2">
              Número de Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              value={formData.telefone}
              onChange={handlePhoneChange}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              disabled={loading}
              maxLength={15}
            />
          </div>

          <div>
            <label htmlFor="pedidos" className="block text-sm font-medium text-gray-200 mb-2">
              Pedidos
            </label>
            <textarea
              id="pedidos"
              value={formData.pedidos}
              onChange={(e) => setFormData({ ...formData, pedidos: e.target.value })}
              placeholder="Ex: Tênis Nike Air Max tamanho 42 até R$400"
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar Pedido
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Seus dados são processados de forma segura e confidencial.
        </p>
      </div>
    </div>
  );
}

export default App;