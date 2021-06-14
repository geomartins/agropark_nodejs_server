
import * as functions from "firebase-functions";
import RolesExtensionCreateChain from
  "../chains/roles/roles_extension_create_chain";
import RolesExtensionUpdateChain from
  "../chains/roles/roles_extension_update_chain";
import RolesExtensionDeleteChain from
  "../chains/roles/roles_extension_delete_chain";

export const createRolesExtension = functions.firestore
    .document("roles/{roleId}/extensions/{extensionId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await (await new
        RolesExtensionCreateChain(snap, context.params.roleId)
            .fetchExtensionCategory()).updateSnapshot();

        await (await a.updateRoleExtensionRef())
            .updateActivities().then(() => {
              console.log("Role-Extension created successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


// DELETE
export const deleteRolesExtension = functions.firestore
    .document("roles/{roleId}/extensions/{extensionId}")
    .onDelete(async (snap, context) => {
      try {
        const rolesDeleteExtensionChain =
        new RolesExtensionDeleteChain(snap, context.params.roleId);

        await rolesDeleteExtensionChain.updateRoleExtensionRef().then(() => {
          console.log("Roles-Extension deleted successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });

// UPDATE
export const updateRolesExtension = functions.firestore
    .document("roles/{roleId}/extensions/{extensionId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateRoleExtensionUpdateChain =
        new RolesExtensionUpdateChain(snap);
        const status = await (await updateRoleExtensionUpdateChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        await (await updateRoleExtensionUpdateChain
            .updateSnapshot()).updateActivities().then(()=> {
          console.log("Roles-Extension updated successfully");
        });
        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


