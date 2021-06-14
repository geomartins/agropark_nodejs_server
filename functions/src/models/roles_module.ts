
import * as functions from "firebase-functions";
import RolesModuleCreateChain from "../chains/roles/roles_module_create_chain";
import RolesModuleDeleteChain from "../chains/roles/roles_module_delete_chain";
import RolesModuleUpdateChain from "../chains/roles/roles_module_update_chain";

export const createRolesModule = functions.firestore
    .document("roles/{roleId}/modules/{moduleId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await (await new
        RolesModuleCreateChain(snap, context.params.roleId)
            .fetchModuleCategory()).updateSnapshot();

        await (await a.updateRoleModuleRef())
            .updateActivities().then(() => {
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

        await rolesDeleteModuleChain.updateRoleModuleRef().then(() => {
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
        new RolesModuleUpdateChain(snap);
        const status = await (await updateRoleModuleUpdateChain
            .verifyIfDocIsEdited()).objectStatus;


        if (status === false) {
          return;
        }

        await (await updateRoleModuleUpdateChain
            .updateSnapshot()).updateActivities().then(()=> {
          console.log("Roles-Module updated successfully");
        });
        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


