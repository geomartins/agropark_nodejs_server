import * as functions from "firebase-functions";

import ExtensionsCreateChain from
  "../chains/extensions/extensions_create_chain";
import ExtensionsUpdateChain from
  "../chains/extensions/extensions_update_chain";
import ExtensionsDeleteChain from
  "../chains/extensions/extensions_delete_chain";


export const createExtensions = functions.firestore
    .document("extensions/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new ExtensionsCreateChain(snap);
        const b = await (await a.updateSnapshot()).updateConfiguration();
        await (await b.updateActivities()).updateAngolia().then(() => {
          console.log("create Extension successfully executed");
          return null;
        });
      } catch (err) {
        console.log(err);
      }
    });


export const updateExtensions = functions.firestore
    .document("extensions/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateExtensionChain =
        new ExtensionsUpdateChain(snap, context.params.docId);
        const status = await (await updateExtensionChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        const updateActivities = await (await (await
        updateExtensionChain.updateSnapshot()).
            updateConfiguration()).updateActivities();

        await (await updateActivities.updateDependencies())
            .updateAngolia().then(()=> {
              console.log("Updated Extension Successfully");
              return null;
            });
        return;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


export const deleteExtensions = functions.firestore
    .document("extensions/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const extensionDeleteChain =
        new ExtensionsDeleteChain(snap, context.params.docId);

        await (await (await extensionDeleteChain.updateConfiguration())
            .updateDependencies()).updateAngolia().then(()=> {
          console.log("Extension delete successful");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });
