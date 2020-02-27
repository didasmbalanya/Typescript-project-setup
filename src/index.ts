import { App } from '@slack/bolt';
import { config as env } from "dotenv";
// import bodyParser from "body-parser";
// import cors from "cors";
//
env();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

// Listens to incoming messages that contain "hello"
app.message('hello', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  // @ts-ignore
  say({
    blocks: [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Hey there <@${message.user}>!`
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Click Me"
        },
        "action_id": "button_click"
      }
    }
    ]
  });
});

app.action('button_click', ({ body, ack, say }) => {
  // Acknowledge the action
  ack();
  say(`<@${body.user.id}> clicked the button`);
});

/* Add functionality here */

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// import express from "express";
// const app = express();
//
// app
//   .use(bodyParser.json())
//   .use(bodyParser.urlencoded({ extended: true }))
//   .use(cors());
//
// // app.use("/slack/events", (req, res) => {
// //   // @ts-ignore
// //   console.log(req.body);
// // });
//
// app.use("/slack/actions", (req, res) => {
//   // @ts-ignore
//   console.log(JSON.parse(req.body.payload));
// });
//
// app.listen(process.env.PORT || 3000, () => {
//   // eslint-disable-next-line
//   console.log(`Server now listening at localhost:${process.env.PORT || 3000}`);
// });
