import FirestoreService from "../../services/firestore_service";

class UsersDocumentCreateChain {
    snapshot: any;
    docRef: any;
    creatorRef: any;
    creator: any;
    userId: string;

    constructor(snapshot: any, userId: string) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.creator = "";
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
      });
      return this;
    }

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "users", "create", "created a new user document",
              this.creator, this.docRef );
      return this;
    }
}

export default UsersDocumentCreateChain;
