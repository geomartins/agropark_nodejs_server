import * as functions from "firebase-functions";
import UsersCreateChain from "../chains/users/users_create_chain";
import UsersUpdateChain from "../chains/users/users_update_chain";

import UsersDocumentCreateChain from
  "../chains/users/users_document_create_chain";

import UsersResetCreateChain from
  "../chains/users/users_reset_create_chain";


export const createUsers = functions.firestore
    .document("users/{userId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new UsersCreateChain(snap);
        const b = await (await (await a.updateSnapshot())
            .createAuth()).createCustomClaim();

        await (await b.updateActivities()).updateAngolia().then(() => {
          console.log("createUserChain successfully executed");
          return null;
        });
      } catch (err) {
        console.log(err);
      }
      return null;
    });


export const updateUsers = functions.firestore
    .document("users/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateUserChain = new UsersUpdateChain(snap);
        const status = await (await updateUserChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }


        const updateDisplayName = await (await (await updateUserChain
            .updateSnapshot()).updateCustomClaims()).updateDisplayName();

        await (await (await updateDisplayName.updateAvatar())
            .updateActivities()).updateAngolia();


        return null;
      } catch (err) {
        console.log(err);
      }

      return null;
    });

export const createUsersDocument = functions.firestore
    .document("users/{userId}/documents/{documentId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await
        new UsersDocumentCreateChain(snap, context.params.userId)
            .updateSnapshot();

        await a.updateActivities().then(() => {
          console.log("Document added Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


export const createUsersReset = functions.firestore
    .document("users/{userId}/resets/{resetId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await
        new UsersResetCreateChain(snap, context.params.userId).updateSnapshot();

        await (await a.updatePassword())
            .updateActivities().then(() => {
              console.log("Password Update Successful");
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


