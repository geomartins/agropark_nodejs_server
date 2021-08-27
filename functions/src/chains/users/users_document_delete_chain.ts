import FirestoreService from "../../services/firestore_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
 */
class UsersDocumentDeleteChain extends NotificationInterface {
    // private snapshot: any;
    private deleter: any;
    // private docRef: any;
    private parentId: string;
    private parentDocRef: any;

    constructor(snapshot: any, parentId: string) {
      super("users", "/topics/users");
      // this.snapshot = snapshot;
      this.deleter = snapshot.data().deleter;
      this.parentId = parentId;
      this.parentDocRef = "";
    }

    private async fetchParentDetails() {
      this.parentDocRef = await new FirestoreService()
          .getUserByUid(this.parentId);
      return this;
    }


    async notify() {
      await this.fetchParentDetails();

      const fullname = this.deleter;
      const item = this.parentDocRef.firstname+ " "+ this.parentDocRef.lastname;

      const genericTitle = "User Document Delete Action!!";
      const genericMessage =
      `${fullname} removed document  from ${item} account`;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("users");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }
}

export default UsersDocumentDeleteChain;
