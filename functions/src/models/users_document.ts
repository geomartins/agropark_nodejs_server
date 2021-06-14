
import * as functions from "firebase-functions";
import UsersDocumentCreateChain from
  "../chains/users/users_document_create_chain";

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

