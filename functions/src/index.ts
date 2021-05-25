import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
const app = express();


// Very Very Important
admin.initializeApp(functions.config().firebase);

import routes from "./routes/routes";
import {createUsers, updateUsers} from "./models/user";
import {createRoles, updateRoles, deleteRoles} from "./models/role";
import {createUsersReset} from "./models/users_reset";
import {createModules, updateModules, deleteModules} from "./models/module";
import {createDepartments, updateDepartments, deleteDepartments}
  from "./models/department";
import {createModuleCategories, updateModuleCategories,
  deleteModuleCategories} from "./models/module_category";


app.use(routes);

const webApi = functions.https.onRequest(app);
export default {
  webApi,

  // Users
  createUsers,
  updateUsers,

  // Users/id/Reset
  createUsersReset,

  // Roles
  createRoles,
  updateRoles,
  deleteRoles,

  // Modules
  createModules,
  updateModules,
  deleteModules,

  // Departments
  createDepartments,
  updateDepartments,
  deleteDepartments,

  // ModuleCategories
  createModuleCategories,
  updateModuleCategories,
  deleteModuleCategories,


};
