const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Te devuelve Pong'),
  execute(interaction) {
    interaction.reply('Pong!'); // Utilizamos interaction.reply para responder a la interacción
  }
};
