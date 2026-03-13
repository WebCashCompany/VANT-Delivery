import { useState, useEffect, memo } from 'react';
import { Send, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
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

  html, body { height: 100%; overflow: hidden; }

  body {
    background: var(--bg);
    font-family: var(--font-body);
    color: var(--white);
  }

  #root { height: 100%; }

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

  /* ── Wrapper geral ── */
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

  /* ── Campo com erro ── */
  .field input.input-error, .field textarea.input-error {
    border-color: rgba(255,107,26,0.5) !important;
    background: rgba(255,107,26,0.04) !important;
    box-shadow: 0 0 0 3px rgba(255,107,26,0.08) !important;
  }

  /* ── Campo válido ── */
  .field input.input-ok, .field textarea.input-ok {
    border-color: rgba(0,188,212,0.4);
    background: rgba(0,188,212,0.05);
  }

  .field input:disabled, .field textarea:disabled { opacity: 0.4; cursor: not-allowed; }
  .field textarea { resize: none; line-height: 1.55; }

  /* ── Hint abaixo do campo ── */
  .field-hint {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    font-weight: 400;
    color: rgba(255,107,26,0.85);
    min-height: 1rem;
    animation: fadeHint 0.2s ease both;
  }

  @keyframes fadeHint {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .field-hint svg { flex-shrink: 0; }

  /* ── Contador de caracteres ── */
  .char-counter {
    text-align: right;
    font-size: 0.65rem;
    color: rgba(122,136,153,0.45);
    margin-top: -0.2rem;
  }

  .char-counter.warn { color: rgba(255,107,26,0.7); }

  /* ── Divisor ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,188,212,0.15), rgba(255,107,26,0.15), transparent);
  }

  /* ── Erro global ── */
  .error-box {
    background: rgba(255,107,26,0.07);
    border: 1px solid rgba(255,107,26,0.2);
    border-radius: 8px;
    padding: 0.6rem 1rem;
    font-size: 0.78rem;
    color: #ffb085;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

// ─────────────────────────────────────────────────────────────────────────────
// REGRAS DE VALIDAÇÃO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NOME
 * - Mínimo 3 chars, máximo 80
 * - Apenas letras (incluindo acentuadas), espaços e hífen
 * - Deve conter pelo menos 2 "palavras" (nome + sobrenome obrigatório)
 * - Sem sequências de caracteres repetidos (aaaa, 1111, etc.)
 * - Sem números ou símbolos
 */
function validateNome(value: string): string {
  const v = value.trim();

  if (!v) return 'Por favor, preencha seu nome completo.';
  if (v.length < 3) return 'Nome muito curto — mínimo 3 caracteres.';
  if (v.length > 80) return 'Nome muito longo — máximo 80 caracteres.';

  // Apenas letras com acentos, espaços e hífens
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(v)) {
    return 'O nome não pode conter números ou símbolos.';
  }

  // Pelo menos duas palavras com 2+ letras cada (nome e sobrenome)
  const words = v.split(/\s+/).filter(w => w.length >= 2);
  if (words.length < 2) return 'Por favor, informe nome e sobrenome.';

  // Bloqueio de sequências repetitivas (ex: "aaaa", "abababab")
  if (/(.)\1{3,}/.test(v.replace(/\s/g, ''))) {
    return 'Nome inválido — caracteres repetitivos detectados.';
  }

  return '';
}

/**
 * TELEFONE
 * - Formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * - DDD válido (11–99, excluindo inexistentes)
 * - Número não pode ser sequência (11111111111, 12345678901)
 * - Não pode ser número de teste conhecido
 */
const INVALID_PHONES = new Set([
  '11999999999','11111111111','22222222222','33333333333','44444444444',
  '55555555555','66666666666','77777777777','88888888888','99999999999',
  '00000000000','12345678901','10987654321',
]);

// DDDs brasileiros válidos
const VALID_DDDS = new Set([
  11,12,13,14,15,16,17,18,19,
  21,22,24,27,28,
  31,32,33,34,35,37,38,
  41,42,43,44,45,46,47,48,49,
  51,53,54,55,
  61,62,63,64,65,66,67,68,69,
  71,73,74,75,77,79,
  81,82,83,84,85,86,87,88,89,
  91,92,93,94,95,96,97,98,99,
]);

function validateTelefone(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) return 'Por favor, informe seu WhatsApp.';
  if (digits.length < 10) return 'Número incompleto — verifique o DDD e o número.';
  if (digits.length > 11) return 'Número inválido — dígitos em excesso.';

  const ddd = parseInt(digits.slice(0, 2), 10);
  if (!VALID_DDDS.has(ddd)) return `DDD (${ddd}) inválido — verifique o código de área.`;

  // Celular deve começar com 9 (11 dígitos) ou fixo (10 dígitos)
  if (digits.length === 11 && digits[2] !== '9') {
    return 'Número de celular deve iniciar com 9 após o DDD.';
  }

  // Sequência inválida (todos iguais ou sequência simples)
  const numPart = digits.slice(2);
  const uniqueChars = new Set(numPart.split('')).size;
  if (uniqueChars <= 2) return 'Número inválido — sequência não reconhecida.';

  if (INVALID_PHONES.has(digits)) return 'Número inválido — use seu WhatsApp real.';

  return '';
}

/**
 * PEDIDO
 * - Mínimo 10 chars, máximo 300
 * - Deve conter ao menos 2 palavras reais (não apenas símbolos ou números)
 * - Sem sequências de caracteres aleatórias (detecta spam por entropia)
 * - Sem excesso de caracteres especiais
 * - Deve ter pelo menos 1 letra (não pode ser só números/símbolos)
 */
function isLowEntropy(text: string): boolean {
  // Detecta sequências randômicas sem sentido:
  // alto ratio de consoantes consecutivas sem vogais
  const noSpaces = text.toLowerCase().replace(/\s/g, '');
  const consonantStreak = noSpaces.match(/[^aeiouàáâãäéêëíîïóôõöúûüy\d\s]{5,}/g);
  if (consonantStreak && consonantStreak.length > 0) return true;

  // Detecta sequências de caracteres totalmente aleatórias
  // via baixa diversidade de bigrams
  if (noSpaces.length >= 8) {
    const bigrams = new Set<string>();
    for (let i = 0; i < noSpaces.length - 1; i++) {
      bigrams.add(noSpaces[i] + noSpaces[i + 1]);
    }
    const diversity = bigrams.size / (noSpaces.length - 1);
    // Texto real geralmente tem diversidade > 0.5
    if (diversity < 0.3 && noSpaces.length > 10) return true;
  }

  return false;
}

function validatePedido(value: string): string {
  const v = value.trim();

  if (!v) return 'Por favor, descreva o que você está procurando.';
  if (v.length < 10) return `Descrição muito curta — mínimo 10 caracteres (${v.length}/10).`;
  if (v.length > 300) return 'Descrição muito longa — máximo 300 caracteres.';

  // Deve conter ao menos uma letra
  if (!/[a-zA-ZÀ-ÿ]/.test(v)) {
    return 'A descrição deve conter palavras, não apenas números ou símbolos.';
  }

  // Mínimo 2 palavras com 2+ letras
  const words = v.match(/[a-zA-ZÀ-ÿ]{2,}/g) ?? [];
  if (words.length < 2) {
    return 'Descreva melhor o produto — use pelo menos 2 palavras.';
  }

  // Excesso de caracteres especiais/símbolos (> 30% do texto)
  const specialCount = (v.match(/[^a-zA-ZÀ-ÿ0-9\s]/g) ?? []).length;
  if (specialCount / v.length > 0.3) {
    return 'A descrição contém caracteres inválidos em excesso.';
  }

  // Detecta texto sem sentido (spam / mash de teclado)
  if (isLowEntropy(v)) {
    return 'Por favor, descreva o produto de forma clara (ex: "Tênis Nike tamanho 42").';
  }

  return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// SANITIZAÇÃO — remove caracteres potencialmente perigosos antes de salvar
// ─────────────────────────────────────────────────────────────────────────────

function sanitize(value: string): string {
  return value
    .replace(/[<>{}[\]\\]/g, '')   // Remove HTML/JSON injection chars
    .replace(/\s{3,}/g, '  ')      // Colapsa múltiplos espaços
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

const VideoBackground = memo(() => (
  <div className="video-bg">
    <video src={bgVideo} autoPlay loop muted playsInline />
  </div>
));

interface FieldHintProps { message: string }
function FieldHint({ message }: FieldHintProps) {
  if (!message) return null;
  return (
    <span className="field-hint">
      <AlertCircle size={11} />
      {message}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [formData, setFormData] = useState({ nome: '', telefone: '', pedidos: '' });

  // Erros por campo — só mostrados após o usuário interagir (blur) ou tentar submeter
  const [touched,  setTouched]  = useState({ nome: false, telefone: false, pedidos: false });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const tag = document.createElement('style');
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => { document.head.removeChild(tag); };
  }, []);

  // ── Erros calculados em tempo real ──────────────────────────────────────────
  const errors = {
    nome:     validateNome(formData.nome),
    telefone: validateTelefone(formData.telefone),
    pedidos:  validatePedido(formData.pedidos),
  };

  const isFormValid = !errors.nome && !errors.telefone && !errors.pedidos;

  // ── Formatação do telefone ───────────────────────────────────────────────────
  const formatPhone = (v: string) => {
    const n = v.replace(/\D/g, '').slice(0, 11);
    if (n.length <= 2)  return n;
    if (n.length <= 7)  return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNomeChange = (v: string) => {
    // Bloqueia números e símbolos em tempo real no campo nome
    const clean = v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
    setFormData(prev => ({ ...prev, nome: clean }));
  };

  const handleTelefoneChange = (v: string) => {
    setFormData(prev => ({ ...prev, telefone: formatPhone(v) }));
  };

  const handlePedidoChange = (v: string) => {
    // Limita a 300 chars e remove caracteres de injeção em tempo real
    const clean = v.replace(/[<>{}[\]\\]/g, '').slice(0, 300);
    setFormData(prev => ({ ...prev, pedidos: clean }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    // Marca todos os campos como tocados para exibir todos os erros
    setTouched({ nome: true, telefone: true, pedidos: true });

    if (!isFormValid) return;

    setLoading(true);
    try {
      await pedidosService.insert({
        nome:     sanitize(formData.nome),
        telefone: formData.telefone,
        pedidos:  sanitize(formData.pedidos),
      });
      setSuccess(true);
      setFormData({ nome: '', telefone: '', pedidos: '' });
      setTouched({ nome: false, telefone: false, pedidos: false });
    } catch (err: any) {
      setApiError(err.message || 'Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ── Classe CSS do campo ──────────────────────────────────────────────────────
  const fieldClass = (field: keyof typeof errors, value: string) => {
    if (!touched[field] || !value.trim()) return '';
    return errors[field] ? 'input-error' : 'input-ok';
  };

  const pedidoLen = formData.pedidos.trim().length;

  return (
    <>
      <VideoBackground />

      <div className="page">
        <div className="card">

          {success ? (
            // ── Tela de sucesso ────────────────────────────────────────────
            <div className="success-card" style={{ margin: '0 auto' }}>
              <div className="success-icon">
                <CheckCircle2 size={30} color="#00bcd4" strokeWidth={1.5} />
              </div>
              <h2>Pedido Recebido</h2>
              <p>
                Seu pedido foi registrado com sucesso.<br />
                Em breve entraremos em contato pelo WhatsApp.
              </p>
              <button className="btn-new" onClick={() => { setSuccess(false); setApiError(''); }}>
                Novo pedido <ArrowRight size={13} />
              </button>
            </div>

          ) : (
            // ── Formulário ────────────────────────────────────────────────
            <>
              <div className="logo-wrap">
                <img src={logo} alt="Promoforia" />
              </div>

              <div className="header">
                <div className="eyebrow">Delivery</div>
                <h1>Seu pedido,<br /><em>nossa missão</em></h1>
                <p>Descreva o produto e encontraremos<br />as melhores opções para você.</p>
              </div>

              <form className="form" onSubmit={handleSubmit} noValidate>

                {/* ── Nome ─────────────────────────────────────────────── */}
                <div className="field">
                  <label htmlFor="nome">Nome completo</label>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Nome e Sobrenome"
                    value={formData.nome}
                    className={fieldClass('nome', formData.nome)}
                    onChange={e => handleNomeChange(e.target.value)}
                    onBlur={() => handleBlur('nome')}
                    disabled={loading}
                    autoComplete="name"
                    maxLength={80}
                  />
                  {touched.nome && errors.nome && (
                    <FieldHint message={errors.nome} />
                  )}
                </div>

                {/* ── Telefone ─────────────────────────────────────────── */}
                <div className="field">
                  <label htmlFor="telefone">WhatsApp</label>
                  <input
                    id="telefone"
                    type="tel"
                    placeholder="(XX) XXXXX-XXXX"
                    value={formData.telefone}
                    className={fieldClass('telefone', formData.telefone)}
                    onChange={e => handleTelefoneChange(e.target.value)}
                    onBlur={() => handleBlur('telefone')}
                    disabled={loading}
                    autoComplete="tel"
                    maxLength={15}
                    inputMode="numeric"
                  />
                  {touched.telefone && errors.telefone && (
                    <FieldHint message={errors.telefone} />
                  )}
                </div>

                <div className="divider" />

                {/* ── Pedido ───────────────────────────────────────────── */}
                <div className="field">
                  <label htmlFor="pedidos">Descreva seu pedido</label>
                  <textarea
                    id="pedidos"
                    placeholder='Ex: Tênis Nike Air Max tamanho 42 até R$ 400'
                    value={formData.pedidos}
                    className={fieldClass('pedidos', formData.pedidos)}
                    onChange={e => handlePedidoChange(e.target.value)}
                    onBlur={() => handleBlur('pedidos')}
                    disabled={loading}
                    rows={3}
                  />
                  {/* Contador de caracteres */}
                  <span className={`char-counter${pedidoLen > 260 ? ' warn' : ''}`}>
                    {pedidoLen}/300
                  </span>
                  {touched.pedidos && errors.pedidos && (
                    <FieldHint message={errors.pedidos} />
                  )}
                </div>

                {/* ── Erro global da API ───────────────────────────────── */}
                {apiError && (
                  <div className="error-box">
                    <AlertCircle size={14} color="#ffb085" />
                    {apiError}
                  </div>
                )}

                {/* ── Botão ─────────────────────────────────────────────── */}
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading
                    ? <><div className="spinner" /> Enviando...</>
                    : <><Send size={14} /> Enviar Pedido</>}
                </button>
              </form>

              <p className="footer-note">Seus dados são tratados com total segurança.</p>
            </>
          )}

        </div>
      </div>
    </>
  );
}