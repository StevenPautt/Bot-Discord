const { SlashCommandBuilder } = require('discord.js');
const db = require('./db');
const Excel = require('exceljs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('users')
    .setDescription('Exportar los usuarios e IPs a un archivo Excel'),
  async execute(interaction) {
    try {
      // Consultar la base de datos para obtener los usuarios e IPs
      const query = 'SELECT nickname, ip, es_vpn, es_proxy, es_tor, pais FROM usuarios';
      db.query(query, async (err, results) => {
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

        // Crear un nuevo libro y una nueva hoja de cálculo en el archivo Excel
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Usuarios e IPs');

        // Definir los encabezados de la tabla en el archivo Excel
        worksheet.columns = [
          { header: 'Usuario', key: 'nickname', width: 30 },
          { header: 'IP', key: 'ip', width: 15 },
          { header: '¿Es una VPN?', key: 'es_vpn', width: 15 },
          { header: '¿Es un proxy?', key: 'es_proxy', width: 15 },
          { header: '¿Es TOR?', key: 'es_tor', width: 15 },
          { header: 'País', key: 'pais', width: 30 },
        ];

        // Agregar los datos de la base de datos a la tabla en el archivo Excel
        for (const entry of results) {
          worksheet.addRow({
            nickname: entry.nickname,
            ip: entry.ip,
            es_vpn: entry.es_vpn, // Mantenemos los valores directos de la base de datos
            es_proxy: entry.es_proxy, // Mantenemos los valores directos de la base de datos
            es_tor: entry.es_tor, // Mantenemos los valores directos de la base de datos
            pais: entry.pais,
          });
        }

        // Escribir los datos en el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        interaction.reply({
          files: [{
            attachment: buffer,
            name: 'usuarios_ips.xlsx',
          }],
        });
      });
    } catch (error) {
      interaction.reply(`Error al leer la base de datos: ${error.message}`);
    }
  },
};
