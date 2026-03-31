
# 🔐 Política de Segurança

## 📦 Versões Suportadas

| Versão | Suporte         |
| ------ | --------------- |
| 1.0.x  | ✅ Suportado     |
| < 1.0  | ❌ Não suportado |

---

## 🚨 Reportar uma Vulnerabilidade

Se você identificou uma vulnerabilidade de segurança no **VANT Delivery**, **não abra uma issue pública**.

De acordo com boas práticas de segurança, vulnerabilidades devem ser reportadas de forma privada para evitar exploração antes da correção ([GitHub Docs][1]).

### 📧 Contato

Envie um e-mail diretamente para:

**[webcashcompany@gmail.com](mailto:webcashcompany@gmail.com)**

---

## 📋 Informações Necessárias no Reporte

Para agilizar a análise e correção, inclua:

* Descrição detalhada da vulnerabilidade
* Passo a passo para reproduzir o problema
* Impacto potencial (ex: vazamento de dados, execução indevida, etc.)
* Trechos de código ou endpoints afetados (se possível)
* Prova de conceito (PoC), se disponível
* Sugestão de correção (opcional)

---

## ⏱️ Tempo de Resposta

Ao reportar uma vulnerabilidade, você pode esperar:

* 📩 Confirmação de recebimento em até **48 horas**
* 🔍 Análise inicial em até **7 dias úteis**
* 🛠️ Correção e atualização conforme criticidade
* 🏆 Crédito público (opcional) após a correção

---

## 🎯 Escopo de Segurança

Este projeto lida diretamente com **dados de usuários**, incluindo:

* Nome e sobrenome
* Número de telefone (WhatsApp)
* Descrição de pedidos

Por isso, as seguintes vulnerabilidades são tratadas como **CRÍTICAS**:

* Vazamento de dados pessoais
* Injeção (ex: MongoDB Injection)
* Falhas de validação de entrada
* Execução indevida no backend (`server.js` / `/api`)
* Exploração da integração com WhatsApp
* Bypass de regras de negócio

---

## 🔒 Boas Práticas Esperadas

Pesquisadores de segurança devem:

* Atuar de boa fé, sem prejudicar usuários ou o sistema
* Não acessar dados de terceiros sem autorização
* Não realizar ataques de negação de serviço (DoS)
* Testar apenas em ambientes controlados

---

## 🚫 O que NÃO fazer

* Divulgar a vulnerabilidade publicamente antes da correção
* Explorar a falha para ganho próprio
* Acessar ou modificar dados reais de usuários

---

## 🔐 Compromisso do Projeto

O **VANT Delivery** leva a segurança a sério, especialmente por envolver:

* Automação de atendimento
* Comunicação via WhatsApp
* Processamento de dados sensíveis

Medidas adotadas (ou recomendadas):

* Validação de dados no frontend e backend
* Sanitização de entradas
* Proteção contra injeções
* Não armazenamento de credenciais sensíveis no repositório ([Check Point Software][2])
* Estrutura preparada para evolução com autenticação e controle de acesso

---

## 📢 Divulgação Responsável

As vulnerabilidades serão:

1. Corrigidas internamente
2. Validadas
3. Publicadas de forma responsável (quando necessário)

---

## 🤝 Agradecimentos

Agradecemos a todos que contribuem para manter o projeto seguro.

Sua colaboração ajuda a proteger usuários e fortalecer o sistema.
