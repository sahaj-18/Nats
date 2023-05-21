const { connect } = require('nats');

async function subscribeToQueue() {
  const nc = await connect({ servers: 'demo.nats.io:4222' });

  // Create a subscription with a queue group
  const subscription = nc.subscribe('my-subject', { queue: 'my-queue-group' });

//   Process incoming messages
  (async () => {
    for await (const message of subscription) {
      console.log(`Received message: ${message.data}`);
      // Process the message here
    }
  })().catch(console.error);

}

subscribeToQueue().catch(console.error);
