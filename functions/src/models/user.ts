import * as functions from "firebase-functions";
import UsersCreateChain from "../chains/users/users_create_chain";
import UsersUpdateChain from "../chains/users/users_update_chain";

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
