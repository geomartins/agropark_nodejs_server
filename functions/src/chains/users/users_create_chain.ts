import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import AuthenticationService from "../../services/authentication_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
 */
class UsersCreateChain extends NotificationInterface {
    private snapshot: any;
    private docRef: any;
    private creatorRef: string;
    private roleRef: string;
    private creator: any;

    constructor(snapshot: any) {
      super("users", "/topics/users");
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.roleRef = snapshot.data().role;
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

    async createAuth() {
      const fullname = this.snapshot.data().firstname+
    " "+ this.snapshot.data().lastname;
      const email = this.snapshot.data().email;

      await new AuthenticationService()
          .createUser(this.snapshot.id, email, fullname);
      return this;
    }

    async createCustomClaim() {
      await new AuthenticationService()
          .addCustomUserClaims(this.snapshot.id, this.roleRef);
      return this;
    }

    async updateDependency() {
      await new FirestoreService()
          .updateDependency(this.moduleName, "create", this.snapshot.id);
      return this;
    }

    async notify() {
      const fullname = this.creator.firstname + " "+ this.creator.lastname;
      const item = this.docRef.firstname+ " "+ this.docRef.lastname;

      const genericTitle = "User Create Action!!";
      const genericMessage = `${fullname} added ${item} to users`;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("users");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("users", this.snapshot)).create();
      return this;
    }
}

export default UsersCreateChain;
