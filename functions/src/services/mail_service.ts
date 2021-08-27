
import * as functions from "firebase-functions";
import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";
const nodemailer = require("nodemailer");
const mandrillTransport = require("nodemailer-mandrill-transport");
const smtpTransport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: functions.config().mandrill.key,
  },
}));

/**
 * @namespace
 */
class MailService {
  private template: any;

  constructor(templateFile: string) {
    const filePath =
        path.join(__dirname, "../../src/views/"+templateFile+".hbs");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    this.template = handlebars.compile(source);
  }


  async send(replacements: object, mailOptions: any) {
    console.log("Mail Servicerrrrrrrrrrrrr");
    // const replacements = {
    //   username: "Umut YEREBAKMAZ",
    // };

    // const mailOptions={
    //   from: "support@agropark.ng",
    //   to: "ict@agropark.ng",
    //   subject: "This is from Mandrill",
    //   html: htmlToSend,
    // };
    const htmlToSend = this.template(replacements);
    mailOptions.html = htmlToSend;
    mailOptions.from = "support@agropark.ng";
    const info = await smtpTransport.sendMail(mailOptions);
    console.log(mailOptions);
    console.log("Message sent: %s", info.messageId);
  }
}


export default MailService;
