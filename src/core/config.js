require('dotenv').config();

module.exports = {
  numeroAsesor: process.env.NUMERO_ASESOR || '54911xxxxxx@c.us',
  advisors: {
    juanjo: process.env.JUANJO_NUMBER || '54911xxxxxx@c.us',
    mari: process.env.MARI_NUMBER || '54911yyyyyy@c.us'
  },
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  bot: {
    name: 'Asistente Virtual',
    reengagementHours: 24,
    maxContextMessages: 10
  }
}; 