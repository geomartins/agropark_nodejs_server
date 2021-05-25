
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class ModulesCreateChain {
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

    async fetchCreatorDetails() {
      this.creator = await new FirestoreService()
          .getUserByUid(this.creatorRef);
      return this;
    }

    async fetchCategoryDetails() {
      this.category = await new FirestoreService()
          .getModuleCategoryById(this.categoryRef);
      return this;
    }

    async updateSnapshot() {
      await this.snapshot.ref.update({
        creator: this.creator,
        category: this.category,
      });
      return this;
    }

    async updateConfiguration() {
      await new FirestoreService()
          .updateConfigurations("modules", "create", this.snapshot.id);
      return this;
    }

    async updateModuleActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateModuleActivities(
              "modules", "create", "created a new module",
              this.creator, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("modules", this.snapshot)).create();
      return this;
    }
}

export default ModulesCreateChain;
