const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
  authStrategy: new LocalAuth(),
});

const BOT_PREFIX = process.env.BOT_PREFIX || '/';
const conversationHistory = {};

// QR Code gerado para fazer login
client.on('qr', (qr) => {
  console.log('Escaneie o QR Code abaixo:');
  qrcode.generate(qr, { small: true });
});

// Bot conectado
client.on('ready', () => {
  console.log('✅ Bot conectado com sucesso!');
});

// Receber mensagens
client.on('message_create', async (msg) => {
  try {
    // Ignorar mensagens do próprio bot
    if (msg.fromMe) return;

    // Verificar se é comando ou conversa normal
    if (msg.body.startsWith(BOT_PREFIX)) {
      await handleCommand(msg);
    } else {
      await handleAIMessage(msg);
    }
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    msg.reply('❌ Desculpe, ocorreu um erro ao processar sua mensagem.');
  }
});

// Processar comandos
async function handleCommand(msg) {
  const command = msg.body.slice(BOT_PREFIX.length).trim().toLowerCase();

  switch (command) {
    case 'help':
      msg.reply(
        '📋 *Comandos disponíveis:*\n\n' +
        '/help - Mostra esta mensagem\n' +
        '/clear - Limpa histórico de conversa\n' +
        '/info - Informações do bot\n\n' +
        '💬 Escreva normalmente para conversar com IA!'
      );
      break;

    case 'clear':
      delete conversationHistory[msg.from];
      msg.reply('✅ Histórico de conversa limpo!');
      break;

    case 'info':
      msg.reply(
        '🤖 *AI Bot WhatsApp*\n\n' +
        'Um bot inteligente alimentado por OpenAI GPT\n' +
        'Use /help para ver comandos disponíveis'
      );
      break;

    default:
      msg.reply('❓ Comando não reconhecido. Use /help para ver comandos disponíveis.');
  }
}

// Processar mensagens de IA
async function handleAIMessage(msg) {
  // Mostrar indicador de digitação
  await client.sendPresenceSubscription(msg.from);

  // Inicializar histórico se não existir
  if (!conversationHistory[msg.from]) {
    conversationHistory[msg.from] = [];
  }

  // Adicionar mensagem do usuário ao histórico
  conversationHistory[msg.from].push({
    role: 'user',
    content: msg.body,
  });

  try {
    // Chamar API OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationHistory[msg.from],
      max_tokens: 512,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message.content;

    // Adicionar resposta ao histórico
    conversationHistory[msg.from].push({
      role: 'assistant',
      content: assistantMessage,
    });

    // Manter apenas últimas 10 mensagens para economia de tokens
    if (conversationHistory[msg.from].length > 20) {
      conversationHistory[msg.from] = conversationHistory[msg.from].slice(-20);
    }

    // Enviar resposta
    msg.reply(assistantMessage);
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    msg.reply('❌ Desculpe, não consegui processar sua mensagem. Tente novamente.');
  }
}

// Iniciar client
client.initialize();

// Tratamento de erro
client.on('disconnected', (reason) => {
  console.log('❌ Bot desconectado:', reason);
});

process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
});
