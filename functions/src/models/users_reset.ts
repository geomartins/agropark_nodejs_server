
import * as functions from "firebase-functions";
import UsersResetCreateChain from "../chains/users/users_reset_create_chain";

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

