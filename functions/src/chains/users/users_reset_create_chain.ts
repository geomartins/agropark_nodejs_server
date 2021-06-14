import FirestoreService from "../../services/firestore_service";
import AuthenticationService from "../../services/authentication_service";

class UsersResetCreateChain {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;
    private password: string;
    private readonly userId: string;

    constructor(snapshot: any, userId: string) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.creator = "";
      this.password = snapshot.data().password;
      this.userId = userId;
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
        password: "",
      });
      return this;
    }

    async updatePassword() {
      await new AuthenticationService()
          .updatePassword(this.userId, this.password);
      return this;
    }

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "users", "create", "created a new user password",
              this.creator, this.docRef );
      return this;
    }
}

export default UsersResetCreateChain;
