import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class ExtensionsCreateChain {
    snapshot: any;
    docRef: any;
    creatorRef: any;
    categoryRef: any;
    creator: any;
    category: any;

    constructor(snapshot: any) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.categoryRef = snapshot.data().category;
      this.creator = "";
      this.category = "";
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

    async updateConfiguration() {
      await new FirestoreService()
          .updateConfigurations("extensions", "create", this.snapshot.id);
      return this;
    }

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "extensions", "create", "created a new extension",
              this.creator, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("extensions", this.snapshot)).create();
      return this;
    }
}

export default ExtensionsCreateChain;
