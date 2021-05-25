

import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class ModuleCategoriesCreateChain {
    snapshot: any;
    docRef: any;
    creatorRef: any;
    creator: any;

    constructor(snapshot: any) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
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

    async updateConfiguration() {
      await new FirestoreService()
          .updateConfigurations("module_categories",
              "create", this.snapshot.id);
      return this;
    }

    async updateModuleActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateModuleActivities(
              "module_categories", "create", "created a new module category",
              this.creator, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("module_categories", this.snapshot)).create();
      return this;
    }
}

export default ModuleCategoriesCreateChain;
