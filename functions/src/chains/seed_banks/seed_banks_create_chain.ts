

import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class SeedBanksCreateChain {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;


    constructor(snapshot: any) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
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

    async updateConfiguration() {
      await new FirestoreService()
          .updateConfigurations("seed_banks", "create", this.snapshot.id);
      return this;
    }

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "seed_banks", "create", "created a new seed bank",
              this.creator, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("seed_banks", this.snapshot)).create();
      return this;
    }
}

export default SeedBanksCreateChain;
