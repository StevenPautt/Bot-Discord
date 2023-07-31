const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const db = require('./db');
const { table } = require('table');

// Reemplaza 'YOUR_API_KEY' con tu clave de API
const apiKey = '63b09a153d4b4bec80be95f0f1e559ae';

// Función para traducir true/false a SI⚠️ o NO
function traducirBoolean(valor) {
  return valor ? 'SI' : 'NO';
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

      // Verificar si la solicitud fue exitosa (código 200)
      if (response.status === 200) {
        const data = response.data;

        // Obtener los valores SI/NO para VPN, Proxy y TOR
        const esVPN = traducirBoolean(data?.security?.vpn);
        const esProxy = traducirBoolean(data?.security?.proxy);
        const esTOR = traducirBoolean(data?.security?.tor);

        // Guardar los datos en la base de datos
        const insertQuery = `INSERT INTO usuarios (nickname, ip, pais, es_vpn, es_proxy, es_tor) VALUES (?, ?, ?, ?, ?, ?)`;
        const insertValues = [nickname, ipAddress, data?.location?.country ?? 'No disponible', esVPN, esProxy, esTOR];
        db.query(insertQuery, insertValues, (err, insertResult) => {
          if (err) {
            console.error('Error al insertar en la base de datos:', err);
            interaction.reply('Error al insertar en la base de datos.');
            return;
          }

          // Mostrar el mensaje con la información sobre la dirección IP
          const tableData = [
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
          const output = table(outputTable);
          const successMessage = '\nInformación agregada a la base de datos.';
          interaction.reply(`\`\`\`${output}${successMessage}\`\`\``);
        });
      } else {
        interaction.reply(`Error en la solicitud. Código de error: ${response.status}`);
      }
    } catch (error) {
      interaction.reply(`Error en la conexión: ${error.message}`);
    }
  },
};
