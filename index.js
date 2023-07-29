const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const config = require("./config.json");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials),
});

client.login(config.token).then(() => {
  loadEvents(client);
  loadCommands(client);
});
