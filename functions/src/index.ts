import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
const app = express();


// Very Very Important
admin.initializeApp(functions.config().firebase);

import routes from "./routes/routes";
import {createUsers, updateUsers} from "./models/user";
import {createRoles, updateRoles, deleteRoles} from "./models/role";
import {createRolesModule, deleteRolesModule, updateRolesModule}
  from "./models/roles_module";
import {createRolesExtension, updateRolesExtension,
  deleteRolesExtension} from "./models/roles_extension";
import {createUsersReset} from "./models/users_reset";
import {createUsersDocument} from "./models/users_document";
import {createModules, updateModules, deleteModules} from "./models/module";
import {createDepartments, updateDepartments, deleteDepartments}
  from "./models/department";

import {createDomains, updateDomains, deleteDomains, scheduledDomains}
  from "./models/domain";

import {createModuleCategories, updateModuleCategories,
  deleteModuleCategories} from "./models/module_category";

import {createExtensions, updateExtensions, deleteExtensions}
  from "./models/extension";

import {createExtensionCategories, updateExtensionCategories,
  deleteExtensionCategories}
  from "./models/extension_category";

app.use(bodyParser.urlencoded({extended: false}));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:7000");
//   res.header("Access-Control-Allow-Methods"
// , "GET, POST, PUT, PATCH, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   next();
// });
app.use(cors());
app.use(routes);

const webApi = functions.https.onRequest(app);
export default {
  webApi,

  // Users
  createUsers,
  updateUsers,

  // Users/id/Reset
  createUsersReset,

  // Users/id/document
  createUsersDocument,

  // Roles
  createRoles,
  updateRoles,
  deleteRoles,

  // Roles/id/module
  createRolesModule,
  deleteRolesModule,
  updateRolesModule,

  // Roles/id/extension
  createRolesExtension,
  deleteRolesExtension,
  updateRolesExtension,


  // Modules
  createModules,
  updateModules,
  deleteModules,

  // Extensions
  createExtensions,
  updateExtensions,
  deleteExtensions,

  // Departments
  createDepartments,
  updateDepartments,
  deleteDepartments,

  // Domains
  createDomains,
  updateDomains,
  deleteDomains,
  scheduledDomains,


  // ModuleCategories
  createModuleCategories,
  updateModuleCategories,
  deleteModuleCategories,

  // ExtensionCategories
  createExtensionCategories,
  updateExtensionCategories,
  deleteExtensionCategories,


};
