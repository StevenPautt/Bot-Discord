module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`El ${client.user.username} esta online`);
  },
};
