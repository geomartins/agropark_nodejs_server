import * as functions from "firebase-functions";
import ModuleCategoriesCreateChain from
  "../chains/module_categories/module_categories_create_chain";

import ModuleCategoriesUpdateChain from
  "../chains/module_categories/module_categories_update_chain";

import ModuleCategoriesDeleteChain from
  "../chains/module_categories/module_categories_delete_chain";

export const createModuleCategories = functions.firestore
    .document("module_categories/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new ModuleCategoriesCreateChain(snap);
        const b = await (await a.updateSnapshot()).updateConfiguration();
        await (await b.updateActivities()).updateAngolia().then(() => {
          console.log("createCategory successfully executed");
          return null;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });


export const deleteModuleCategories = functions.firestore
    .document("module_categories/{docId}")
    .onDelete(async (snap, context) => {
      try {
        await (await new ModuleCategoriesDeleteChain(snap)
            .updateConfiguration()).updateAngolia().then(() => {
          console.log("Module category deleted successfully");
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });


export const updateModuleCategories = functions.firestore
    .document("module_categories/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateModuleCategoryChain = new ModuleCategoriesUpdateChain(snap);
        const status = await (await updateModuleCategoryChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }


        const updateActivities = await (await (await
        updateModuleCategoryChain.updateSnapshot())
            .updateConfiguration()).updateActivities();

        await updateActivities.updateAngolia().then(() => {
          console.log("ModuleCategories updated successfully");
          return;
        });


        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


