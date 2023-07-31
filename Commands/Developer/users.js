const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('users')
    .setDescription('Ver los usuarios e IPs guardados en la base de datos'),
  async execute(interaction) {
    try {
      // Leer el archivo JSON actual (si existe)
      let database = [];
      try {
        const databaseContent = await fs.readFile('database.json', 'utf8');
        database = JSON.parse(databaseContent);
      } catch (error) {
        // El archivo no existe o está vacío
      }

      if (database.length === 0) {
        interaction.reply('La base de datos está vacía.');
        return;
      }

      // Construir la lista de usuarios e IPs
      let userList = 'Usuarios e IPs en la base de datos:\n';
      for (const entry of database) {
        userList += `Usuario: ${entry.nickname}, IP: ${entry.ip}\n`;
      }

      interaction.reply(userList);
    } catch (error) {
      interaction.reply(`Error al leer la base de datos: ${error.message}`);
    }
  },
};