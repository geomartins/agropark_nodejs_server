import * as functions from "firebase-functions";
import RolesDeleteChain from "../chains/roles/roles_delete_chain";
import RolesCreateChain from "../chains/roles/roles_create_chain";
import RolesUpdateChain from "../chains/roles/roles_update_chain";

export const createRoles = functions.firestore
    .document("roles/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new RolesCreateChain(snap);
        const b = await (await a.updateSnapshot()).updateConfiguration();
        await (await b.updateActivities()).updateAngolia().then(() => {
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
        const rolesDeleteChain = new RolesDeleteChain(snap);
        await (await rolesDeleteChain.updateConfiguration())
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

        const updateActivities = (await (await updateRoleChain.
            updateSnapshot()).updateConfiguration()).updateActivities();

        await (await updateActivities).updateAngolia().then(()=> {
          console.log("Role Updated successfully");
        });
        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });
