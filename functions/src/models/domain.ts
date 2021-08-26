import * as functions from "firebase-functions";

import DomainsCreateChain from "../chains/domains/domains_create_chain";
import DomainsDeleteChain from "../chains/domains/domains_delete_chain";
import DomainsUpdateChain from "../chains/domains/domains_update_chain";
import DomainsScheduleChain from "../chains/domains/domains_schedule_chain";

/**
 * Domain Module used to create domain,
 *  update domain, delete domain and schedule domain
 * @module domain
 */


/**
 *
 * @param createDomains - Helps to create domains
 *
 */
export const createDomains = functions.firestore
    .document("domains/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new DomainsCreateChain(snap);

        const b = await (await a.updateSnapshot()).updateDependency();
        await (await b.notify()).updateAngolia().then(() => {
          console.log("Domain created successfully");
          return null;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });


/**
 * @param deleteDomains
 */
export const deleteDomains = functions.firestore
    .document("domains/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const deleteDomainChain = new DomainsDeleteChain(snap);
        await (await (await deleteDomainChain.updateDependency())
            .notify()).updateAngolia().then(() => {
          console.log("Domain deleted successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return;
    });


/**
 * This helps to update domain to the database...
 * it is dependent on DomainsUpdateChain class
 *
 * @param updateDomains
 */
export const updateDomains = functions.firestore
    .document("domains/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateDomainChain = new DomainsUpdateChain(snap);
        const status = await (await updateDomainChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        await (await (await updateDomainChain.updateSnapshot())
            .notify()).updateAngolia().then(() => {
          console.log("Domain Updated Successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return null;
      }

      return;
    });


/**
 * @param scheduledDomains
 */
export const scheduledDomains = functions.pubsub.schedule("0 11 * * *")
    .onRun(async (context) => {
      try {
        await (await (await new DomainsScheduleChain()
            .fetchExpiringDomainSnapshot())
            .updateAlreadyExpiredDomain())
            .notify().then(() => {
              console.log("scheduled domain cronjob is completed");
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });

