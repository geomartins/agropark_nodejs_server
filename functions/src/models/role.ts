import * as functions from "firebase-functions";
import RolesDeleteChain from "../chains/roles/roles_delete_chain";
import RolesCreateChain from "../chains/roles/roles_create_chain";
import RolesUpdateChain from "../chains/roles/roles_update_chain";

export const createRoles = functions.firestore
    .document("roles/{docId}")
    .onCreate(async (snap, context) => {
      const a = (await new RolesCreateChain(snap)
          .fetchCreatorDetails());
      const b = await (await a.updateSnapshot()).updateConfiguration();
      await (await b.updateModuleActivities()).updateAngolia().then(() => {
        console.log("createRole successfully executed");
        return null;
      }).catch((err) => {
        console.log(err);
      });
      return null;
    });

export const deleteRoles = functions.firestore
    .document("roles/{docId}")
    .onDelete(async (snap, context) => {
      const rolesDeleteChain = new RolesDeleteChain(snap);
      await (await (await rolesDeleteChain
          .updateConfiguration())
          .updateModuleActivities())
          .updateAngolia().then(() => {
            console.log("deleteRoleChain succesfully executed");
          }).catch((err: any) => {
            console.log(err);
          });
      return null;
    });


export const updateRoles = functions.firestore
    .document("roles/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateRoleChain = new RolesUpdateChain(snap);
        const userType = await (await updateRoleChain
            .verifyUserTypeAndEvent())
            .userType;

        if (userType == "") {
          return;
        }

        if (userType == "deleter") {
          await updateRoleChain.deleteSnapshot();
          return;
        }

        if (userType == "editor") {
          const updatedSnapshot = await (await (await updateRoleChain
              .verifyUserTypeAndEvent())
              .fetchUserDetails()).updateSnapshot();

          const status = await (await updatedSnapshot.checkObjectStatus())
              .objectStatus;

          if (status == false) {
            return;
          }
          if (status == true) {
            (await (await (await updatedSnapshot.checkObjectStatus())
                .updateConfiguration()).updateModuleActivities())
                .updateAngolia();
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }


      return null;
    });
