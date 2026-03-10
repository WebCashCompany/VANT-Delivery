import { useState, useEffect, memo } from 'react';
import { Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { pedidosService } from './lib/pedidos.service';
import logo from './assets/logo.png';
import bgVideo from './assets/background.mp4';

const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap';
document.head.appendChild(fontLink);

const styles = `
  :root {
    --bg:           #050508;
    --cyan:         #00bcd4;
    --orange:       #ff6b1a;
    --silver:       #7a8899;
    --white:        #e8f0f5;
    --border-c:     rgba(0,188,212,0.18);
    --font-display: 'Orbitron', monospace;
    --font-body:    'DM Sans', sans-serif;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--cyan), var(--orange));
    border-radius: 99px;
  }
  * { scrollbar-width: thin; scrollbar-color: var(--cyan) var(--bg); }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    background: var(--bg);
    font-family: var(--font-body);
    color: var(--white);
  }

  #root {
    height: 100%;
  }

  /* ── Vídeo de fundo ── */
  .video-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  .video-bg video {
    position: absolute;
    top: 50%; left: 50%;
    min-width: 100%; min-height: 100%;
    width: auto; height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }

  .video-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(160deg, rgba(5,5,8,0.82) 0%, rgba(5,5,8,0.70) 50%, rgba(5,5,8,0.85) 100%),
      radial-gradient(ellipse 55% 45% at 15% 10%, rgba(0,188,212,0.08) 0%, transparent 65%),
      radial-gradient(ellipse 45% 40% at 85% 90%, rgba(255,107,26,0.07) 0%, transparent 60%);
  }

  .video-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0,188,212,0.08) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 1;
  }

  /* ── Wrapper geral — ocupa 100vh sem scroll ── */
  .page {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1.5rem;
    position: relative;
    z-index: 1;
  }

  .card {
    width: 100%;
    max-width: 460px;
    animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Logo ── */
  .logo-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 0.9rem;
    animation: fadeUp 0.7s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .logo-wrap img {
    height: 90px;
    width: auto;
    filter:
      drop-shadow(0 0 20px rgba(0,188,212,0.45))
      drop-shadow(0 0 40px rgba(255,107,26,0.2));
  }

  /* ── Header ── */
  .header {
    text-align: center;
    margin-bottom: 1rem;
    animation: fadeUp 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .eyebrow {
    font-family: var(--font-display);
    font-size: 0.55rem;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 0.45rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .eyebrow::before, .eyebrow::after {
    content: '';
    flex: 1;
    max-width: 48px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--orange));
  }
  .eyebrow::after { background: linear-gradient(90deg, var(--orange), transparent); }

  .header h1 {
    font-family: var(--font-display);
    font-size: 1.55rem;
    font-weight: 600;
    color: var(--white);
    line-height: 1.2;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .header h1 em {
    font-style: normal;
    background: linear-gradient(90deg, var(--cyan), var(--orange));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header p {
    margin-top: 0.4rem;
    font-size: 0.8rem;
    color: var(--silver);
    font-weight: 300;
    line-height: 1.5;
  }

  /* ── Form card ── */
  .form {
    background: rgba(3,3,8,0.92);
    border: 1px solid var(--border-c);
    border-radius: 16px;
    padding: 1.25rem;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    animation: fadeUp 0.7s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
    box-shadow:
      0 0 0 1px rgba(0,188,212,0.06) inset,
      0 24px 64px rgba(0,0,0,0.85),
      0 0 80px rgba(0,188,212,0.04);
    position: relative;
  }

  .form::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), var(--orange), transparent);
    border-radius: 99px;
  }

  /* ── Campos ── */
  .field { display: flex; flex-direction: column; gap: 0.35rem; }

  .field label {
    font-family: var(--font-display);
    font-size: 0.52rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cyan);
    opacity: 0.85;
  }

  .field input, .field textarea {
    background: rgba(0,188,212,0.04);
    border: 1px solid rgba(0,188,212,0.12);
    border-radius: 8px;
    padding: 0.7rem 1rem;
    color: var(--white);
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 300;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  .field input::placeholder, .field textarea::placeholder {
    color: rgba(122,136,153,0.4);
  }

  .field input:focus, .field textarea:focus {
    border-color: rgba(0,188,212,0.5);
    background: rgba(0,188,212,0.06);
    box-shadow: 0 0 0 3px rgba(0,188,212,0.08), 0 0 16px rgba(0,188,212,0.06);
  }

  .field input:disabled, .field textarea:disabled { opacity: 0.4; cursor: not-allowed; }
  .field textarea { resize: none; line-height: 1.55; }

  /* ── Divisor ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,188,212,0.15), rgba(255,107,26,0.15), transparent);
  }

  /* ── Erro ── */
  .error-box {
    background: rgba(255,107,26,0.07);
    border: 1px solid rgba(255,107,26,0.2);
    border-radius: 8px;
    padding: 0.6rem 1rem;
    font-size: 0.78rem;
    color: #ffb085;
  }

  /* ── Botão ── */
  .btn-submit {
    position: relative;
    width: 100%;
    padding: 0.85rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan) 0%, #0097a7 50%, var(--orange) 100%);
    background-size: 200% 200%;
    background-position: 0% 50%;
    color: #050508;
    font-family: var(--font-display);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    transition: background-position 0.4s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(0,188,212,0.25), 0 2px 8px rgba(255,107,26,0.15);
    overflow: hidden;
  }

  .btn-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%);
  }

  .btn-submit:hover:not(:disabled) {
    background-position: 100% 50%;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,188,212,0.35), 0 4px 16px rgba(255,107,26,0.2);
  }

  .btn-submit:active:not(:disabled) { transform: translateY(0); }
  .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(5,5,12,0.25);
    border-top-color: #050508;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .footer-note {
    text-align: center;
    font-size: 0.65rem;
    color: rgba(122,136,153,0.35);
    margin-top: 1rem;
    letter-spacing: 0.04em;
    animation: fadeUp 0.7s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* ── Sucesso ── */
  .success-card {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 360px;
    animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .success-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,188,212,0.12), rgba(0,188,212,0.04));
    border: 1px solid rgba(0,188,212,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    animation: glow 2.5s ease-in-out infinite;
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,188,212,0.15), 0 0 20px rgba(0,188,212,0.1); }
    50%       { box-shadow: 0 0 0 18px rgba(0,188,212,0), 0 0 40px rgba(0,188,212,0.2); }
  }

  .success-card h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: linear-gradient(90deg, var(--cyan), var(--orange));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.75rem;
  }

  .success-card p {
    font-size: 0.85rem;
    color: var(--silver);
    line-height: 1.75;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .btn-new {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    border: 1px solid rgba(0,188,212,0.25);
    border-radius: 8px;
    background: transparent;
    color: var(--cyan);
    font-family: var(--font-display);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }

  .btn-new:hover {
    background: rgba(0,188,212,0.07);
    border-color: rgba(0,188,212,0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0,188,212,0.12);
  }
`;

// Fora do App + memo → nunca remontado em re-renders nem em troca de estado
const VideoBackground = memo(() => (
  <div className="video-bg">
    <video src={bgVideo} autoPlay loop muted playsInline />
  </div>
));

export default function App() {
  const [formData, setFormData] = useState({ nome: '', telefone: '', pedidos: '' });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    const tag = document.createElement('style');
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => { document.head.removeChild(tag); };
  }, []);

  const formatPhone = (v: string) => {
    const n = v.replace(/\D/g, '');
    if (n.length <= 2) return n;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
  };

  const validate = () => {
    if (!formData.nome.trim())                                      { setError('Por favor, preencha seu nome'); return false; }
    if (!formData.telefone.trim() || formData.telefone.length < 14) { setError('Telefone inválido — use (XX) XXXXX-XXXX'); return false; }
    if (!formData.pedidos.trim())                                   { setError('Por favor, descreva seu pedido'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
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
      setError(err.message || 'Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Vídeo sempre montado — não desmonta ao trocar success */}
      <VideoBackground />

      <div className="page">
        <div className="card">

          {success ? (
            // ── Tela de sucesso ──────────────────────────────────────────────
            <div className="success-card" style={{ margin: '0 auto' }}>
              <div className="success-icon">
                <CheckCircle2 size={30} color="#00bcd4" strokeWidth={1.5} />
              </div>
              <h2>Pedido Recebido</h2>
              <p>
                Seu pedido foi registrado com sucesso.<br />
                Em breve entraremos em contato pelo WhatsApp.
              </p>
              <button className="btn-new" onClick={() => { setSuccess(false); setError(''); }}>
                Novo pedido <ArrowRight size={13} />
              </button>
            </div>

          ) : (
            // ── Formulário ───────────────────────────────────────────────────
            <>
              <div className="logo-wrap">
                <img src={logo} alt="VANT" />
              </div>

              <div className="header">
                <div className="eyebrow">Delivery</div>
                <h1>Seu pedido,<br /><em>nossa missão</em></h1>
                <p>Descreva o produto e encontraremos<br />as melhores opções para você.</p>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="nome">Nome completo</label>
                  <input
                    id="nome" type="text"
                    placeholder="Como devemos te chamar?"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label htmlFor="telefone">WhatsApp</label>
                  <input
                    id="telefone" type="tel"
                    placeholder="(XX) XXXXX-XXXX"
                    value={formData.telefone}
                    onChange={e => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                    disabled={loading}
                    maxLength={15}
                  />
                </div>

                <div className="divider" />

                <div className="field">
                  <label htmlFor="pedidos">Descreva seu pedido</label>
                  <textarea
                    id="pedidos"
                    placeholder="Ex: Tênis Nike Air Max tamanho 42 até R$400"
                    value={formData.pedidos}
                    onChange={e => setFormData({ ...formData, pedidos: e.target.value })}
                    disabled={loading}
                    rows={3}
                  />
                </div>

                {error && <div className="error-box">{error}</div>}

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? <><div className="spinner" /> Enviando...</>
                    : <><Send size={14} /> Enviar Pedido</>
                  }
                </button>
              </form>

              <p className="footer-note">Seus dados são tratados com total segurança e confidencialidade.</p>
            </>
          )}

        </div>
      </div>
    </>
  );
}