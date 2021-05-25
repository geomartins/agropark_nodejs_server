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
      const a = (await new ModuleCategoriesCreateChain(snap)
          .fetchCreatorDetails());
      const b = await (await a.updateSnapshot()).updateConfiguration();
      await (await b.updateModuleActivities()).updateAngolia().then(() => {
        console.log("createCategory successfully executed");
        return null;
      }).catch((err) => {
        console.log(err);
      });
      return null;
    });


export const deleteModuleCategories = functions.firestore
    .document("module_categories/{docId}")
    .onDelete(async (snap, context) => {
      const deleteModuleCategoryChain = new ModuleCategoriesDeleteChain(snap);
      await (await (await deleteModuleCategoryChain
          .updateConfiguration())
          .updateModuleActivities())
          .updateAngolia().then(() => {
            console.log("deleteModuleCategoryChain succesfully executed");
          }).catch((err) => {
            console.log(err);
          });
      return null;
    });


export const updateModuleCategories = functions.firestore
    .document("module_categories/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateModuleCategoryChain = new ModuleCategoriesUpdateChain(snap);
        const userType = await (await updateModuleCategoryChain
            .verifyUserTypeAndEvent())
            .userType;

        if (userType == "") {
          return;
        }

        if (userType == "deleter") {
          await updateModuleCategoryChain.deleteSnapshot();
          return;
        }

        if (userType == "editor") {
          const updatedSnapshot = await (await (await updateModuleCategoryChain
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


