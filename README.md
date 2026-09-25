# WhatsApp AI Bot 🤖

Um bot inteligente para WhatsApp alimentado por IA (OpenAI GPT).

## Recursos

✨ **Principais funcionalidades:**
- 💬 Conversa com IA usando OpenAI GPT
- 📝 Mantém histórico de conversa
- 🎯 Suporte a comandos
- 🔐 Autenticação local segura
- ⚡ Respostas rápidas e inteligentes

## Pré-requisitos

- Node.js 14+ instalado
- Chave de API OpenAI ([obter aqui](https://platform.openai.com/api-keys))
- WhatsApp ativo no seu celular

## Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/Jeamy1/whatsapp-ai-bot.git
cd whatsapp-ai-bot
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave OpenAI:
```
OPENAI_API_KEY=sua_chave_aqui
BOT_NAME=AI Bot
BOT_PREFIX=/
```

## Como usar

### Iniciar o bot
```bash
npm start
```

Você verá um QR Code no terminal. Escaneie com seu WhatsApp.

### Conversar com o bot

Apenas envie uma mensagem normal para iniciar uma conversa:
```
Oi, como você está?
```

O bot responderá com uma mensagem gerada por IA!

### Comandos disponíveis

| Comando | Descrição |
|---------|----------|
| `/help` | Mostra ajuda e comandos disponíveis |
| `/clear` | Limpa o histórico de conversa |
| `/info` | Informações sobre o bot |

## Arquitetura

```
┌─────────────────┐
│   WhatsApp      │
└────────┬────────┘
         │
┌────────▼────────────────┐
│  WhatsApp-Web.js Client │
└────────┬────────────────┘
         │
┌────────▼──────────────┐
│   Message Handler     │
└────────┬──────────────┘
         │
    ┌────┴────┐
    │          │
┌───▼──┐  ┌───▼────────┐
│Commands│  │OpenAI API │
└────────┘  └────────────┘
```

## Custo

⚠️ **Importante:** Cada mensagem enviada para OpenAI gera custos. Verifique os preços em [platform.openai.com/pricing](https://platform.openai.com/pricing).

Dicas para economizar:
- Use `gpt-3.5-turbo` (mais barato)
- Limitar `max_tokens` a 512
- Implementar sistema de créditos por usuário

## Configuração Avançada

### Mudar modelo de IA

No arquivo `index.js`, altere a linha:
```javascript
model: 'gpt-3.5-turbo', // ou 'gpt-4'
```

### Ajustar personalidade do bot

Adicione um "system prompt" antes de processar mensagens:
```javascript
conversationHistory[msg.from].unshift({
  role: 'system',
  content: 'Você é um assistente útil e amigável. Responda em português.',
});
```

## Troubleshooting

### "QR Code não aparece"
- Verifique se o Node.js está instalado corretamente
- Tente remover a pasta `.wwebjs_auth` e reconectar

### "Erro de API"
- Confirme que sua chave OpenAI está correta
- Verifique se você tem créditos disponíveis
- Verifique os limites de taxa (rate limits)

### "Bot não responde"
- Verifique a conexão de internet
- Veja os logs do console para erros
- Tente usar `/clear` para limpar o histórico

## Licença

MIT - Veja LICENSE para detalhes

## Contribuir

Pull requests são bem-vindas! Para mudanças maiores, abra uma issue primeiro.

## Suporte

Tem dúvidas? Abra uma [issue](https://github.com/Jeamy1/whatsapp-ai-bot/issues) no repositório.
