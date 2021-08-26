import * as functions from "firebase-functions";

import FeedbacksCreateChain from
  "../chains/feedbacks/feedbacks_create_chain";

import FeedbacksDeleteChain from
  "../chains/feedbacks/feedbacks_delete_chain";

import FeedbacksUpdateChain from
  "../chains/feedbacks/feedbacks_update_chain";


export const createFeedbacks = functions.firestore
    .document("feedbacks/{docId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new FeedbacksCreateChain(snap);

        await (await (await a.updateSnapshot()).notify())
            .updateAngolia().then(() => {
              console.log("Feedbacks created successfully");
              return null;
            });
      } catch (err) {
        console.log(err);
        return;
      }
    });

export const deleteFeedbacks = functions.firestore
    .document("feedbacks/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const deleteFeedbackChain = new FeedbacksDeleteChain(snap);
        await (await deleteFeedbackChain.updatePushy())
            .updateAngolia().then(() => {
              console.log("Feedback deleted successfully");
              return;
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return;
    });


export const updateFeedbacks = functions.firestore
    .document("feedbacks/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateFeedbackChain = new FeedbacksUpdateChain(snap);
        const status = await (await updateFeedbackChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        await (await (await
        updateFeedbackChain.updateSnapshot())
            .updatePushy()).updateAngolia().then(() => {
          console.log("Feedback Updated Successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return null;
      }

      return;
    });


