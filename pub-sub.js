const { connect, StringCodec } = require("nats");

async function run() {
  try {
    // to create a connection to a NATS server:
    const nc = await connect({ servers: "demo.nats.io:4222" });

    // create a codec
    const sc = StringCodec();
    // create a simple subscriber and iterate over messages
    // matching the subscription
    const sub = nc.subscribe("hello");

    (async () => {
      for await (const m of sub) {
        console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
      }
      console.log("subscription closed");
    })();

    nc.publish("hello", sc.encode("world"));
    nc.publish("hello", sc.encode("again"));

    await nc.drain();

    // Close the connection
    await nc.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
