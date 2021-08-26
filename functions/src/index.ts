import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
const app = express();
app.use(helmet());


const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: any) => {
  console.log("connected ................................");
  // socket.on("disconnect", () => {
  //   console.log("A user disconnected");
  // });
  // socket.on("connect", () => {
  //   console.log("A user disconnected");
  // });
  // setInterval(function() {
  //   socket.emit("stream", {title: "Is this real"});
  // }, 100);
});


// Very Very Important
admin.initializeApp(functions.config().firebase);

import routes from "./routes/routes";
import * as roles from "./models/role";
import * as users from "./models/user";
import * as feedbacks from "./models/feedback";
import * as seed_banks from "./models/seed_bank";
import * as domains from "./models/domain";
import * as extensions from "./models/extension";
import * as modules from "./models/module";
import * as exphbs from "express-handlebars";
// import * as path from "path";

app.engine("hbs", exphbs({extname: "hbs"}));
app.set("view engine", "hbs");
// app.set("trust proxy", true);
app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(routes);


app.use((error: any, req:any, res: any, next: any) => {
  return res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});


http.listen(5000, () => {
  console.log("Listening on port *: 3000");
});
const webApi = functions.https.onRequest(app);


export default {
  webApi,

  ...users,
  ...roles,
  ...modules,
  ...extensions,

  ...feedbacks,
  ...domains,
  ...seed_banks,


};
