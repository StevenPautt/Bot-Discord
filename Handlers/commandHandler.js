const { SlashCommandBuilder } = require('discord.js');

function loadCommands(client) {
  const ascii = require('ascii-table');
  const fs = require('fs');
  const table = new ascii().setHeading('Commands', 'Status');

  let commandsArray = [];

  const commandsFolder = fs.readdirSync('./Commands');

  // Verificar si client.commands existe y, en caso contrario, inicializarlo como Collection
  if (!client.commands) {
    client.commands = new Map();
  }

  for (const folder of commandsFolder) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const commandFile = require(`../Commands/${folder}/${file}`);
      if (!commandFile || !commandFile.data) {
        console.log(`Error loading command from file: ${file}`);
        continue;
      }

      client.commands.set(commandFile.data.name, commandFile);

      commandsArray.push(commandFile.data.toJSON());
      table.addRow(file, 'Loaded');
    }
  }
  client.application.commands.set(commandsArray);
  console.log(table.toString(), '\nLoaded');
}

module.exports = { loadCommands };
