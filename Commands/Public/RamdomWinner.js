const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  developer: false,
  data: new SlashCommandBuilder()
    .setName('elegirganador')
    .setDescription('Elige al azar entre dos jugadores')
    .addStringOption(option =>
      option.setName('jugador1')
        .setDescription('Primer jugador')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('jugador2')
        .setDescription('Segundo jugador')
        .setRequired(true)
    ),
  execute(interaction) {
    const jugador1 = interaction.options.getString('jugador1');
    const jugador2 = interaction.options.getString('jugador2');

    // Generar un número aleatorio entre 0 y 1
    const resultado = Math.random();

    // Decidir al ganador basado en el resultado del número aleatorio
    let ganador;
    if (resultado < 0.5) {
      ganador = jugador1;
    } else {
      ganador = jugador2;
    }

    // Responder con el nombre del ganador
    interaction.reply(`El ganador es: ${ganador}!`);
  }
};