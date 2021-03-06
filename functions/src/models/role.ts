import * as functions from "firebase-functions";
import RolesDeleteChain from "../chains/roles/roles_delete_chain";
import RolesCreateChain from "../chains/roles/roles_create_chain";
import RolesUpdateChain from "../chains/roles/roles_update_chain";


import RolesExtensionCreateChain from
  "../chains/roles/roles_extension_create_chain";
import RolesExtensionUpdateChain from
  "../chains/roles/roles_extension_update_chain";
import RolesExtensionDeleteChain from
  "../chains/roles/roles_extension_delete_chain";


import RolesModuleCreateChain from "../chains/roles/roles_module_create_chain";
import RolesModuleDeleteChain from "../chains/roles/roles_module_delete_chain";
import RolesModuleUpdateChain from "../chains/roles/roles_module_update_chain";


/**
 * @module role
 */
// [Roles] -> [] [@create, @update, @delete]
export const createRoles = functions.firestore
    .document("roles/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new RolesCreateChain(snap);
        const b = await (await a.updateSnapshot()).updateDependency();
        await (await b.notify()).updateAngolia().then(() => {
          console.log("Role created successfully");
          return null;
        });
      } catch (err) {
        console.log(err);
        return err;
      }
    });

export const deleteRoles = functions.firestore
    .document("roles/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const rolesDeleteChain =
        new RolesDeleteChain(snap);
        await (await (await rolesDeleteChain.updateDependency()).notify())
            .updateAngolia().then(() => {
              console.log("Role deleted successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return;
      }
    });


export const updateRoles = functions.firestore
    .document("roles/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateRoleChain = new RolesUpdateChain(snap);
        const status = await (await updateRoleChain
            .verifyIfDocIsEdited()).objectStatus;


        if (status === false) {
          return;
        }

        (await (await updateRoleChain.
            updateSnapshot()).notify()).updateAngolia()
            .then(()=> {
              console.log("Role Updated successfully");
            });
        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


// [Roles] -> [Extension] [@create, @update, @delete]
export const createRolesExtension = functions.firestore
    .document("roles/{roleId}/extensions/{extensionId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await (await new
        RolesExtensionCreateChain(snap, context.params.roleId)
            .fetchExtensionCategory()).updateSnapshot();

        await (await a.updateRoleExtensionRef())
            .notify().then(() => {
              console.log("Role-Extension created successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });

export const deleteRolesExtension = functions.firestore
    .document("roles/{roleId}/extensions/{extensionId}")
    .onDelete(async (snap, context) => {
      try {
        const rolesDeleteExtensionChain =
        new RolesExtensionDeleteChain(snap, context.params.roleId);

        await (await rolesDeleteExtensionChain.updateRoleExtensionRef())
            .notify().then(() => {
              console.log("Roles-Extension deleted successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return;
      }
    });

export const updateRolesExtension = functions.firestore
    .document("roles/{roleId}/extensions/{extensionId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateRoleExtensionUpdateChain =
        new RolesExtensionUpdateChain(snap, context.params.roleId);
        const status = await (await updateRoleExtensionUpdateChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        await (await updateRoleExtensionUpdateChain
            .updateSnapshot()).notify().then(()=> {
          console.log("Roles-Extension updated successfully");
        });
        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


// [Roles] -> [Module] [@create, @update, @delete]
export const createRolesModule = functions.firestore
    .document("roles/{roleId}/modules/{moduleId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await (await new
        RolesModuleCreateChain(snap, context.params.roleId)
            .fetchModuleCategory()).updateSnapshot();


        await (await a.updateRoleModuleRef())
            .notify().then(() => {
              console.log("Role-Module created successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


// DELETE
export const deleteRolesModule = functions.firestore
    .document("roles/{roleId}/modules/{moduleId}")
    .onDelete(async (snap, context) => {
      try {
        const rolesDeleteModuleChain =
        new RolesModuleDeleteChain(snap, context.params.roleId);

        await (await rolesDeleteModuleChain.updateRoleModuleRef()).notify()
            .then(() => {
              console.log("Roles-Module deleted successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return;
      }
    });

// UPDATE
export const updateRolesModule = functions.firestore
    .document("roles/{roleId}/modules/{moduleId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateRoleModuleUpdateChain =
        new RolesModuleUpdateChain(snap, context.params.roleId);
        const status = await (await updateRoleModuleUpdateChain
            .verifyIfDocIsEdited()).objectStatus;


        if (status === false) {
          return;
        }

        await (await updateRoleModuleUpdateChain
            .updateSnapshot()).notify().then(()=> {
          console.log("Roles-Module updated successfully");
        });
        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


