
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class SeedBanksDeleteChain {
  constructor(protected snapshot: any) {}


  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("seed_banks", "delete", this.snapshot.id);
    return this;
  }

  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("seed_banks", this.snapshot)).delete();
    return this;
  }
}

export default SeedBanksDeleteChain;
