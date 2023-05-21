const { connect } = require("nats");

async function connectToServers() {
  const servers = [
    { servers: ["demo.nats.io:4442", "demo.nats.io:4222"] },
    { servers: "demo.nats.io:4443" },
    { port: 4222 },
    { servers: "localhost" },
  ];

  for (const v of servers) {
    try {
      const nc = await connect(v);
      console.log(`connected to ${nc.getServer()}`);
      const done = nc.closed();

      // do something with the connection

      await nc.close();
      const err = await done;
      if (err) {
        console.log(`error closing:`, err);
      }
    } catch (err) {
      console.log(`error connecting to ${JSON.stringify(v)}`);
    }
  }
}

connectToServers();
