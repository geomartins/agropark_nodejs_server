import * as functions from "firebase-functions";

import ModulesCreateChain from "../chains/modules/modules_create_chain";
import ModulesUpdateChain from "../chains/modules/modules_update_chain";
import ModulesDeleteChain from "../chains/modules/modules_delete_chain";

export const createModules = functions.firestore
    .document("modules/{docId}")
    .onCreate(async (snap, context) => {
      const a = await (await new ModulesCreateChain(snap)
          .fetchCreatorDetails()).fetchCategoryDetails();
      const b = await (await a.updateSnapshot()).updateConfiguration();
      await (await b.updateModuleActivities()).updateAngolia().then(() => {
        console.log("createModule successfully executed");
        return null;
      }).catch((err: any) => {
        console.log(err);
      });
      return null;
    });


export const updateModules = functions.firestore
    .document("modules/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateModuleChain = new ModulesUpdateChain(snap);
        const userType = await (await updateModuleChain
            .verifyUserTypeAndEvent())
            .userType;

        if (userType == "") {
          return;
        }

        if (userType == "deleter") {
          await updateModuleChain.deleteSnapshot();
          return;
        }

        if (userType == "editor") {
          const updatedSnapshot = await (await (await updateModuleChain
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


export const deleteModules = functions.firestore
    .document("modules/{docId}")
    .onDelete(async (snap, context) => {
      const moduleDeleteChain = new ModulesDeleteChain(snap);
      await (await (await moduleDeleteChain
          .updateConfiguration())
          .updateModuleActivities())
          .updateAngolia().then(() => {
            console.log("deleteModuleChain succesfully executed");
          }).catch((err) => {
            console.log(err);
          });
      return null;
    });
