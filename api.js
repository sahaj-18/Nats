const express = require('express');
const { connect, StringCodec } = require('nats');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const sc = StringCodec();

// Connect to NATS server
connect({ servers: 'demo.nats.io:4222' })
  .then(async (nc) => {
    console.log('Connected to NATS server');
    // Subscribe to a subject
    const subscription = nc.subscribe('api.events');
    (async function () {
      for await (const m of subscription) {
        // Handle incoming messages
        const data = sc.decode(m.data);
        console.log('Received message:', data);
      }
    })().catch((err) => {
      console.error('Error handling NATS subscription:', err);
    });

    // API endpoint
    app.post('/api/event', (req, res) => {
      const eventData = req.body;

      // Publish event to NATS subject
      nc.publish('api.events', sc.encode(JSON.stringify(eventData)));

      res.status(200).json({ message: 'Event published successfully' });
    });

    // Start the server
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to NATS server:', err);
  });
