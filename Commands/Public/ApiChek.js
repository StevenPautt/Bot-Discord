const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const db = require('./db');
const { table } = require('table');

const apiKey = '63b09a153d4b4bec80be95f0f1e559ae';

function traducirBoolean(valor) {
  return valor ? 'SI ⚠️' : 'NO';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ipinfo')
    .setDescription('Obtener información sobre una dirección IP')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('Dirección IP a consultar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nickname')
        .setDescription('Nickname asociado a la dirección IP')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ipAddress = interaction.options.getString('ip');
    const nickname = interaction.options.getString('nickname');
    const url = `https://vpnapi.io/api/${ipAddress}?key=${apiKey}`;

    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        const data = response.data;

        const esVPN = traducirBoolean(data?.security?.vpn);
        const esProxy = traducirBoolean(data?.security?.proxy);
        const esTOR = traducirBoolean(data?.security?.tor);

        const outputTable = [
          ['Información sobre la dirección IP', ipAddress],
          ['¿Es una VPN?', esVPN],
          ['¿Es un proxy?', esProxy],
          ['¿Es TOR?', esTOR],
          ['País', data?.location?.country ?? 'No disponible']
        ];

        // Configuración de la tabla
        const config = {
          columns: {
            0: { width: 40, wrapWord: true },
            1: { width: 20, wrapWord: true }
          },
          drawHorizontalLine: (index, size) => {
            return index === 0 || index === 1 || index === size;
          }
        };

        const output = table(outputTable, config);

        const sqlQuery = `INSERT INTO usuarios (nickname, ip, es_vpn, es_proxy, es_tor, pais) VALUES (?, ?, ?, ?, ?, ?)`;
        const insertValues = [nickname, ipAddress, esVPN, esProxy, esTOR, data?.location?.country ?? 'No disponible'];

        db.query(sqlQuery, insertValues, (err, insertResult) => {
          if (err) {
            console.error('Error al insertar en la base de datos:', err);
            interaction.reply('Error al insertar en la base de datos.');
            return;
          }

          const successMessage = `\nInformación agregada a la base de datos:\n${output}`;
          interaction.reply(successMessage);
        });
      } else {
        interaction.reply(`Error en la solicitud. Código de error: ${response.status}`);
      }
    } catch (error) {
      interaction.reply(`Error en la conexión: ${error.message}`);
    }
  },
};
