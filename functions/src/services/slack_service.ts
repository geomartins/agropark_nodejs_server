import * as functions from "firebase-functions";
const slack = require("slack-notify")(functions.config().slack.webhook);

class SlackService {
  private channel: string;
  private username: string;
  private icon_url: string;
  constructor(channel: string, username: string) {
    this.channel = channel;
    this.username = username;
    this.icon_url = "https://agropark.ng/screenshots/kenzo/logo-512.png";
  }

  async push(
      text: string, fields: any) {
    return slack.send({
      channel: this.channel,
      icon_url: this.icon_url,
      username: this.username,
      text: text,
      fields: fields,
    });
  }
}

export default SlackService;
