
import * as functions from "firebase-functions";
import UsersResetCreateChain from "../chains/users/users_reset_create_chain";

export const createUsersReset = functions.firestore
    .document("users/{userId}/resets/{resetId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await (await
        new UsersResetCreateChain(snap, context.params.userId)
            .fetchCreatorDetails()).updateSnapshot();

        await (await a.updatePassword())
            .updateModuleActivities().then(() => {
              console.log("Password Update Successful");
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });

