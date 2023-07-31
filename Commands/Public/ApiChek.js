const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs').promises;

// Reemplaza 'YOUR_API_KEY' con tu clave de API
const apiKey = '63b09a153d4b4bec80be95f0f1e559ae';

// Función para traducir true/false a SI⚠️ o NO
function traducirBoolean(valor) {
  return valor ? 'SI⚠️' : '';
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

        // Realizar la traducción de true/false a SI⚠️ o NO usando la función traducirBoolean
        const esVPN = traducirBoolean(data?.security?.vpn);
        const esProxy = traducirBoolean(data?.security?.proxy);
        const esTOR = traducirBoolean(data?.security?.tor);

        // Construir la respuesta con la información de la dirección IP
        let replyMessage = `Información sobre la dirección IP ${ipAddress}:\n`
          + `¿Es una VPN?: ${esVPN}\n`
          + `¿Es un proxy?: ${esProxy}\n`
          + `¿Es TOR?: ${esTOR}\n`
          + `País: ${data?.location?.country ?? 'No disponible'}\n`
          + `Continente: ${data?.location?.continent ?? 'No disponible'}\n`
          + `Código del país: ${data?.location?.country_code ?? 'No disponible'}\n`
          + `Latitud: ${data?.location?.latitude ?? 'No disponible'}\n`
          + `Longitud: ${data?.location?.longitude ?? 'No disponible'}\n`
          + `Zona horaria: ${data?.location?.time_zone ?? 'No disponible'}\n`
          + `Autonomous System Number (ASN): ${data?.network?.autonomous_system_number ?? 'No disponible'}\n`
          + `Autonomous System Organization (ASO): ${data?.network?.autonomous_system_organization ?? 'No disponible'}`;

        // Leer el archivo JSON actual (si existe)
        let database = [];
        try {
          const databaseContent = await fs.readFile('database.json', 'utf8');
          database = JSON.parse(databaseContent);
        } catch (error) {
          // El archivo no existe o está vacío
        }

        // Verificar si la IP o el nickname ya están en la base de datos
        const existsInDatabase = database.some((entry) => entry.ip === ipAddress || entry.nickname === nickname);

        if (existsInDatabase) {
          // Si la IP o el nickname ya están en la base de datos, mostrar el mensaje correspondiente
          replyMessage += `\nYa existe en la base de datos: Usuario ${nickname} con IP ${ipAddress}`;
        } else {
          // Si no existe, agregar el nuevo objeto a la base de datos
          const newData = {
            ip: ipAddress,
            nickname: nickname,
            esVPN: data?.security?.vpn,
            esProxy: data?.security?.proxy,
            esTOR: data?.security?.tor,
            country: data?.location?.country ?? 'No disponible',
            continent: data?.location?.continent ?? 'No disponible',
            country_code: data?.location?.country_code ?? 'No disponible',
            latitude: data?.location?.latitude ?? 'No disponible',
            longitude: data?.location?.longitude ?? 'No disponible',
            time_zone: data?.location?.time_zone ?? 'No disponible',
            autonomous_system_number: data?.network?.autonomous_system_number ?? 'No disponible',
            autonomous_system_organization: data?.network?.autonomous_system_organization ?? 'No disponible',
          };
          database.push(newData);

          // Escribir el contenido actualizado en el archivo JSON
          await fs.writeFile('database.json', JSON.stringify(database, null, 2));

          // Mostrar el mensaje de que se agregó la información
          replyMessage += '\nInformación agregada a la base de datos.';
        }

        // Responder con la información completa
        await interaction.reply(replyMessage);
      } else {
        interaction.reply(`Error en la solicitud. Código de error: ${response.status}`);
      }
    } catch (error) {
      interaction.reply(`Error en la conexión: ${error.message}`);
    }
  },
};
