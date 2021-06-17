
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class SeedBankCropCategoriesDeleteChain {
  constructor(protected snapshot: any) {}

  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("seed_bank_crop_categories",
            "delete", this.snapshot.id);
    return this;
  }

  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("seed_bank_crop_categories",
        this.snapshot)).delete();
    return this;
  }
}

export default SeedBankCropCategoriesDeleteChain;
