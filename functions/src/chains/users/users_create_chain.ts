import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import AuthenticationService from "../../services/authentication_service";

class UsersCreateChain {
    snapshot: any;
    docRef: any;
    creatorRef: string;
    roleRef: string;
    creator: string | {} | void;
    constructor(snapshot: any) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.roleRef = snapshot.data().role;
      this.creator = "";
    }

    async fetchCreatorDetails() {
      this.creator = await new FirestoreService()
          .getUserByUid(this.creatorRef);
      return this;
    }


    async updateSnapshot() {
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

    async updateModuleActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateModuleActivities(
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
