import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
const app = express();


// Very Very Important
admin.initializeApp(functions.config().firebase);

import routes from "./routes/routes";

import * as roles from "./models/role";
import * as users from "./models/user";
import * as seed_bank_crop_categories from "./models/seed_bank_crop_category";
import * as seed_banks from "./models/seed_bank";
import * as domains from "./models/domain";
import * as extensions from "./models/extension";
import * as modules from "./models/module";
import * as module_categories from "./models/module_category";
import * as extension_categories from "./models/extension_category";
import * as departments from "./models/department";

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(routes);

app.use((error: any, req:any, res: any, next: any) => {
  return res.status(error.httpStatusCode ?? 500).json(error);
});
const webApi = functions.https.onRequest(app);


export default {
  webApi,

  ...users,
  ...roles,
  ...domains,
  ...seed_bank_crop_categories,
  ...seed_banks,
  ...modules,
  ...module_categories,
  ...extensions,
  ...extension_categories,
  ...departments,


};
