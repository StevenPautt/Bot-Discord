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
          ['País', data?.location?.country ?? 'No disponible'],
          ['Continente', data?.location?.continent ?? 'No disponible'],
          ['Código del país', data?.location?.country_code ?? 'No disponible'],
          ['Latitud', data?.location?.latitude ?? 'No disponible'],
          ['Longitud', data?.location?.longitude ?? 'No disponible'],
          ['Zona horaria', data?.location?.time_zone ?? 'No disponible'],
          ['Autonomous System Number (ASN)', data?.network?.autonomous_system_number ?? 'No disponible'],
          ['Autonomous System Organization (ASO)', data?.network?.autonomous_system_organization ?? 'No disponible'],
        ];

        // Configuración de la tabla
        const config = {
          border: {
            topBody: '═',
            topJoin: '╤',
            topLeft: '╔',
            topRight: '╗',

            bottomBody: '═',
            bottomJoin: '╧',
            bottomLeft: '╚',
            bottomRight: '╝',

            bodyLeft: '│',
            bodyRight: '│',
            bodyJoin: '│',

            joinBody: '─',
            joinLeft: '├',
            joinRight: '┤',
            joinJoin: '┼'
          },
          singleLine: true
        };

        // Generar la tabla con los datos y la configuración
        const formattedTable = table(outputTable, config);

        const sqlQuery = `INSERT INTO usuarios (nickname, ip, es_vpn, es_proxy, es_tor, pais) VALUES (?, ?, ?, ?, ?, ?)`;
        const insertValues = [nickname, ipAddress, esVPN, esProxy, esTOR, data?.location?.country ?? 'No disponible'];

        db.query(sqlQuery, insertValues, (err, insertResult) => {
          if (err) {
            console.error('Error al insertar en la base de datos:', err);
            interaction.reply('Error al insertar en la base de datos.');
            return;
          }

          const successMessage = `\nInformación agregada a la base de datos:\n${formattedTable}`;
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
