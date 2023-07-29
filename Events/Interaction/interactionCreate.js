const config = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return interaction.reply({ content: "Comando Deshabilitado" });

        if (command.developer && interaction.user.id !== config.developers) return interaction.reply({ content: "Comando solo disponible para desarrolladores" });

        command.execute(interaction); // Pasamos solo la interacción como argumento
    }
};
