import * as functions from "firebase-functions";

import ModulesCreateChain from "../chains/modules/modules_create_chain";
import ModulesUpdateChain from "../chains/modules/modules_update_chain";
import ModulesDeleteChain from "../chains/modules/modules_delete_chain";

export const createModules = functions.firestore
    .document("modules/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new ModulesCreateChain(snap);
        const b = await (await a.updateSnapshot()).updateConfiguration();
        await (await b.updateActivities()).updateAngolia().then(() => {
          console.log("createModule successfully executed");
          return null;
        });
      } catch (err) {
        console.log(err);
      }
    });


export const updateModules = functions.firestore
    .document("modules/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateModuleChain =
        new ModulesUpdateChain(snap, context.params.docId);
        const status = await (await updateModuleChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        const updateActivities = await (await (await
        updateModuleChain.updateSnapshot()).
            updateConfiguration()).updateActivities();

        await (await updateActivities.updateDependencies())
            .updateAngolia().then(()=> {
              console.log("Updated Module Categories Successfully");
              return null;
            });
        return;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


export const deleteModules = functions.firestore
    .document("modules/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const moduleDeleteChain =
        new ModulesDeleteChain(snap, context.params.docId);

        await (await (await moduleDeleteChain.updateConfiguration())
            .updateDependencies()).updateAngolia().then(()=> {
          console.log("Module delete successful");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });
