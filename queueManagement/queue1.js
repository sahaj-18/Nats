const { connect } = require('nats');

async function publishMessage() {
  const nc = await connect({ servers: 'demo.nats.io:4222' });

  setInterval(() => {
    const message =  Buffer.from(`Message from Publisher at ${new Date().toLocaleTimeString()}`);
    nc.publish('my-subject', message);
    console.log(`Published: ${message}`);
  }, 1000);

//   await nc.flush();
//   await nc.close();
}

publishMessage().catch(console.error);
