import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import AuthenticationService from "../../services/authentication_service";

class UsersCreateChain {
    private snapshot: any;
    private docRef: any;
    private creatorRef: string;
    private roleRef: string;
    private creator: string | {} | void;

    constructor(snapshot: any) {
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

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "users", "create", "created a new user",
              this.creator, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("users", this.snapshot)).create();
      return this;
    }
}

export default UsersCreateChain;
