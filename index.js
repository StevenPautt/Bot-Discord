const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
// Elimina la línea const config = require("./config.json");

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials),
});

const token = process.env.DISCORD_TOKEN; // Accede al token desde la variable de entorno

client.login(token).then(() => {
  loadEvents(client);
  loadCommands(client);
});