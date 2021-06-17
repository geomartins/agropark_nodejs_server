import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
const app = express();


// Very Very Important
admin.initializeApp(functions.config().firebase);

import routes from "./routes/routes";
import {createRolesModule, deleteRolesModule, updateRolesModule}
  from "./models/roles_module";
import {createRolesExtension, updateRolesExtension,
  deleteRolesExtension} from "./models/roles_extension";
import {createUsersReset} from "./models/users_reset";
import {createUsersDocument} from "./models/users_document";


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
const webApi = functions.https.onRequest(app);


export default {
  webApi,

  // Users/id/Reset
  createUsersReset,

  // Users/id/document
  createUsersDocument,


  // Roles/id/module
  createRolesModule,
  deleteRolesModule,
  updateRolesModule,

  // Roles/id/extension
  createRolesExtension,
  deleteRolesExtension,
  updateRolesExtension,


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
