import * as functions from "firebase-functions";

import SeedBanksCreateChain from
  "../chains/seed_banks/seed_banks_create_chain";

import SeedBanksDeleteChain from
  "../chains/seed_banks/seed_banks_delete_chain";

import SeedBanksUpdateChain
  from "../chains/seed_banks/seed_banks_update_chain";

import SeedBanksInventoryCreateChain from
  "../chains/seed_banks/seed_banks_inventory_create_chain";

import SeedBanksInventoryUpdateChain
  from "../chains/seed_banks/seed_banks_inventory_update_chain";

export const createSeedBanks = functions.firestore
    .document("seed_banks/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new SeedBanksCreateChain(snap);

        const b = await (await a.updateSnapshot()).updateConfiguration();
        const c = await (await (await b.updateActivities())
            .updateSnapshot()).notify();

        await c.updateAngolia().then(() => {
          console.log("SeedBank created successfully");
          return null;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });

export const deleteSeedBanks = functions.firestore
    .document("seed_banks/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const deleteSeedBankChain = new SeedBanksDeleteChain(snap);
        await (await (await deleteSeedBankChain.updateConfiguration())
            .updatePushy()).updateAngolia().then(() => {
          console.log("SeedBank deleted successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return;
    });


export const updateSeedBanks = functions.firestore
    .document("seed_banks/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateSeedBankChain = new SeedBanksUpdateChain(snap);
        const status = await (await updateSeedBankChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        const updateActivities = await (await (await
        updateSeedBankChain.updateSnapshot())
            .updateConfiguration()).updateActivities();

        await (await updateActivities.updatePushy())
            .updateAngolia().then(() => {
              console.log("SeedBank Updated Successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return null;
      }

      return;
    });


export const createSeedBanksInventory = functions.firestore
    .document("seed_banks/{seedBankId}/inventories/{inventoryId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await (await new
        SeedBanksInventoryCreateChain(snap, context.params.seedBankId)
            .updateSnapshot()
        ).updateActivities();

        await a.updatePushy().then(() => {
          console.log("SeedBanks-Inventory created successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });

export const updateSeedBanksInventory = functions.firestore
    .document("seed_banks/{seedBankId}/inventories/{inventoryId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateSeedBanksInventoryUpdateChain =
        new SeedBanksInventoryUpdateChain(snap);
        const status = await (await updateSeedBanksInventoryUpdateChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        const updateActivity = await (await updateSeedBanksInventoryUpdateChain
            .updateSnapshot()).updateActivities();
        await updateActivity.updatePushy().then(()=> {
          console.log("SeedBanks-Inventory updated successfully");
        });
        return null;
      } catch (err) {
        console.log(err);
        return null;
      }
    });


