const { SlashCommandBuilder } = require('discord.js');
const db = require('./db');
const Table = require('table');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('users')
    .setDescription('Ver los usuarios e IPs guardados en la base de datos'),
  async execute(interaction) {
    try {
      // Consultar la base de datos para obtener los usuarios e IPs
      const query = 'SELECT nickname, ip FROM users';
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

        // Crear la tabla con los resultados de la consulta
        const data = [['Usuario', 'IP']];
        for (const entry of results) {
          data.push([entry.nickname, entry.ip]);
        }
        const config = {
          columns: {
            0: {
              alignment: 'left',
              width: 30,
            },
            1: {
              alignment: 'left',
              width: 15,
            },
          },
        };
        const table = Table.table(data, config);

        // Responder con la tabla formateada
        interaction.reply('Usuarios e IPs en la base de datos:\n```' + table + '```');
      });
    } catch (error) {
      interaction.reply(`Error al leer la base de datos: ${error.message}`);
    }
  },
};
