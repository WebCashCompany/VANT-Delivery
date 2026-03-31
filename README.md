
# 🚀 VANT Delivery

Sistema inteligente de **captura de pedidos + automação via WhatsApp**, desenvolvido para transformar descrições simples de clientes em **recomendações automatizadas de produtos**.

🔗 **Website:** [https://vant-delivery.vercel.app/](https://vant-delivery.vercel.app/)

---

## 📌 Sobre o Projeto

O **VANT Delivery** é uma aplicação fullstack que atua como um **assistente de vendas automatizado**.

O usuário informa seus dados e descreve o que deseja. O sistema processa essa informação e envia automaticamente, via bot no WhatsApp, **os 3 melhores produtos recomendados**.

Esse modelo reduz fricção no atendimento e aumenta conversão.

---

## ⚙️ Funcionamento

### Entrada do usuário:

* Nome
* Sobrenome
* Telefone (WhatsApp)
* Descrição do produto desejado

### Processamento:

* Interpretação da descrição
* Busca/seleção dos melhores produtos
* Geração de resposta personalizada

### Saída:

* Envio automático via WhatsApp com:

  * 📦 3 melhores produtos
  * 💬 Mensagem personalizada
  * 📲 Contato direto com o cliente

---

## 🧠 Arquitetura do Projeto

```bash
VANT-Delivery/
│
├── api/                # Rotas e integração com automação (WhatsApp / lógica)
├── src/                # Frontend (React + TypeScript)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── hooks/
│
├── server.js           # Servidor backend (Node.js)
├── index.html          # Entry HTML
├── package.json        # Dependências
├── tailwind.config.js  # Configuração de estilos
├── vite.config.ts      # Build tool
└── vercel.json         # Deploy config
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Vite

### Backend

* Node.js
* API própria (`/api`)
* Integração com serviço de envio para WhatsApp

### Infraestrutura

* Vercel (deploy e hosting)

---

## 🚀 Execução Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar o projeto

```bash
npm run dev
```

### 3. Acessar no navegador

```bash
http://localhost:5173
```

---

## 🔌 Fluxo Técnico

```text
Frontend (React)
      ↓
Formulário
      ↓
API / Backend (Node.js)
      ↓
Processamento da descrição
      ↓
Integração com Bot WhatsApp
      ↓
Envio automático de mensagem
```

---

## 📲 Integração com WhatsApp

O sistema pode ser conectado com:

* WhatsApp Business API
* Twilio
* Z-API
* Evolution API

O backend é responsável por:

* Formatar a mensagem
* Inserir dados do cliente
* Enviar os produtos recomendados

---

## 🎯 Casos de Uso

* Dropshipping
* Lojas digitais
* Atendimento automatizado
* Geração de leads
* MVP de startups
* Funil de vendas via WhatsApp

---

## 📈 Diferenciais

* Atendimento automático (zero esforço humano)
* Alta conversão via WhatsApp
* UX simples e direta
* Estrutura escalável (pronto para SaaS)
* Baixo custo operacional

---

## 🔐 Segurança

* Validação de inputs no frontend e backend
* Estrutura preparada para sanitização de dados
* Possibilidade de autenticação futura

---

## 🤝 Contribuição

```bash
git checkout -b feature/minha-feature
git commit -m "feat: nova funcionalidade"
git push origin feature/minha-feature
```

---

## 💡 Posicionamento Estratégico

O VANT Delivery não é apenas um sistema de pedidos.

Ele funciona como:

* 🧠 **Assistente de vendas automatizado**
* 📲 **Motor de conversão via WhatsApp**
* 🚀 **Base para SaaS de atendimento inteligente**
