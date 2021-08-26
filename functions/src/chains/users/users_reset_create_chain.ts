import FirestoreService from "../../services/firestore_service";
import AuthenticationService from "../../services/authentication_service";
import NotificationInterface from "../../interfaces/notification";

class UsersResetCreateChain extends NotificationInterface {
    private snapshot: any;
    // private docRef: any;
    private creatorRef: any;
    private creator: any;
    private password: string;
    private readonly userId: string;
    private parentDocRef: any;

    constructor(snapshot: any, userId: string) {
      super("users", "/topics/users");
      this.snapshot = snapshot;
      // this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.creator = "";
      this.password = snapshot.data().password;
      this.userId = userId;
      this.parentDocRef = "";
    }

    private async fetchCreatorDetails() {
      this.creator = await new FirestoreService()
          .getUserByUid(this.creatorRef);
      this.parentDocRef = await new FirestoreService()
          .getUserByUid(this.userId);
      return this;
    }


    async updateSnapshot() {
      await this.fetchCreatorDetails();
      await this.snapshot.ref.update({
        creator: this.creator,
        password: "",
      });
      return this;
    }

    async updatePassword() {
      await new AuthenticationService()
          .updatePassword(this.userId, this.password);
      return this;
    }

    async notify() {
      const fullname = this.creator.firstname + " "+ this.creator.lastname;
      const item = this.parentDocRef.firstname+ " "+ this.parentDocRef.lastname;

      const genericTitle = "User Password Create Action!!";
      const genericMessage =
      `${fullname} created a new password on ${item} account`;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("users");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }
}

export default UsersResetCreateChain;
