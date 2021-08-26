

import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

class FeedbacksCreateChain extends NotificationInterface {
    private snapshot: any;
    // private docRef: any;
    private creatorRef: any;
    private creator: any;

    constructor(snapshot: any) {
      super("feedbacks", "/topics/feedbacks");
      this.snapshot = snapshot;
      // this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.creator = "";
    }


    private async fetchCreatorDetails() {
      this.creator = await new FirestoreService()
          .getUserByUid(this.creatorRef);
      return this;
    }


    async updateSnapshot() {
      await this.fetchCreatorDetails();
      await this.snapshot.ref.update({
        creator: this.creator,
      });
      return this;
    }

    async notify() {
      const fullname = this.creator.firstname + " "+ this.creator.lastname;

      const genericTitle = "Feedback Create Action!!";
      const genericMessage = `${fullname} added new feedback`;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("feedbacks");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }


    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService(this.moduleName, this.snapshot)).create();
      return this;
    }
}

export default FeedbacksCreateChain;
