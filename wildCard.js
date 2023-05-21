const { connect, StringCodec } = require("nats");

async function run() {
  try {
    const nc = await connect({ servers: "demo.nats.io:4222" });
    const sc = StringCodec();

    const s1 = nc.subscribe("help.*.system");
    const s2 = nc.subscribe("help.me.*");
    const s3 = nc.subscribe("help.>");

    async function printMsgs(s) {
      let subj = s.getSubject();
      console.log(`listening for ${subj}`);
      const c = 13 - subj.length;
      const pad = "".padEnd(c);
      for await (const m of s) {
        console.log(
          `[${subj}]${pad} #${s.getProcessed()} - ${m.subject}${
            m.data ? " " + sc.decode(m.data) : ""
          }`
        );
      }
    }

    printMsgs(s1);
    printMsgs(s2);
    printMsgs(s3);

    // don't exit until the client closes
    await nc.closed();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
