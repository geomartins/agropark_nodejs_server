import * as functions from "firebase-functions";

import SeedBankCropCategoriesCreateChain from
  "../chains/seed_bank_crop_categories/seed_bank_crop_categories_create_chain";

import SeedBankCropCategoriesDeleteChain from
  "../chains/seed_bank_crop_categories/seed_bank_crop_categories_delete_chain";

import SeedBankCropCategoriesUpdateChain from
  "../chains/seed_bank_crop_categories/seed_bank_crop_categories_update_chain";


export const createSeedBankCropCategories = functions.firestore
    .document("seed_bank_crop_categories/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new SeedBankCropCategoriesCreateChain(snap);

        const b = await (await a.updateSnapshot()).updateConfiguration();
        await (await b.updateActivities()).updateAngolia().then(() => {
          console.log("Crop Category created successfully");
          return null;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });

export const deleteSeedBankCropCategories = functions.firestore
    .document("seed_bank_crop_categories/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const deleteCropCategoryChain =
        new SeedBankCropCategoriesDeleteChain(snap);
        await (await (await deleteCropCategoryChain.updateConfiguration())
            .updateAngolia()).updateAngolia().then(() => {
          console.log("Seed Bank Crop Category deleted successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return;
    });


export const updateSeedBankCropCategories = functions.firestore
    .document("seed_bank_crop_categories/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateCropCategoryChain =
        new SeedBankCropCategoriesUpdateChain(snap);
        const status = await (await updateCropCategoryChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        const updateActivities = await (await (await
        updateCropCategoryChain.updateSnapshot())
            .updateConfiguration()).updateActivities();

        await updateActivities.updateAngolia().then(() => {
          console.log("Seed Bank Crop Category Updated Successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return null;
      }

      return;
    });
