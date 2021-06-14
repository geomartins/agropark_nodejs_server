
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class ExtensionCategoriesDeleteChain {
  constructor(protected snapshot: any) {}

  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("extension_categories",
            "delete", this.snapshot.id);
    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("extension_categories", this.snapshot)).delete();
    return this;
  }
}

export default ExtensionCategoriesDeleteChain;
