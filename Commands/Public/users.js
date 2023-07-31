const { SlashCommandBuilder } = require('discord.js');
const db = require('./db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('users')
    .setDescription('Ver los usuarios e IPs guardados en la base de datos'),
  async execute(interaction) {
    try {
      // Consultar la base de datos para obtener los usuarios e IPs
      const query = 'SELECT nickname, ip FROM usuarios';
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error al consultar la base de datos:', err);
          interaction.reply('Ocurrió un error al consultar la base de datos.');
          return;
        }

        // Verificar si la consulta devuelve resultados
        if (results.length === 0) {
          interaction.reply('La base de datos está vacía.');
          return;
        }

        // Construir la lista de usuarios e IPs
        let userList = 'Usuarios e IPs en la base de datos:\n';
        for (const entry of results) {
          userList += `Usuario: ${entry.nickname}, IP: ${entry.ip}\n`;
        }

        interaction.reply(userList);
      });
    } catch (error) {
      interaction.reply(`Error al leer la base de datos: ${error.message}`);
    }
  },
};
