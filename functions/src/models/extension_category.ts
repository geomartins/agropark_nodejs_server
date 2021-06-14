import * as functions from "firebase-functions";
import ExtensionCategoriesCreateChain from
  "../chains/extension_categories/extension_categories_create_chain";

import ExtensionCategoriesUpdateChain from
  "../chains/extension_categories/extension_categories_update_chain";

import ExtensionCategoriesDeleteChain from
  "../chains/extension_categories/extension_categories_delete_chain";

export const createExtensionCategories = functions.firestore
    .document("extension_categories/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new ExtensionCategoriesCreateChain(snap);
        const b = await (await a.updateSnapshot()).updateConfiguration();
        await (await b.updateActivities()).updateAngolia().then(() => {
          console.log("create Extension Category successfully executed");
          return null;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });


export const deleteExtensionCategories = functions.firestore
    .document("extension_categories/{docId}")
    .onDelete(async (snap, context) => {
      try {
        await (await new ExtensionCategoriesDeleteChain(snap)
            .updateConfiguration()).updateAngolia().then(() => {
          console.log("Extension category deleted successfully");
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });


export const updateExtensionCategories = functions.firestore
    .document("extension_categories/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateExtensionCategoryChain =
        new ExtensionCategoriesUpdateChain(snap);
        const status = await (await updateExtensionCategoryChain
            .verifyIfDocIsEdited()).objectStatus;

        console.log(status);

        if (status === false) {
          return;
        }


        const updateExtensionActivities = await (await (await
        updateExtensionCategoryChain.updateSnapshot())
            .updateConfiguration()).updateActivities();

        await updateExtensionActivities.updateAngolia().then(() => {
          console.log("Extension Categories updated successfully");
          return;
        });


        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


