
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class DomainsDeleteChain {
  constructor(protected snapshot: any) {}

  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("domains", "delete", this.snapshot.id);
    return this;
  }

  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("domains", this.snapshot)).delete();
    return this;
  }
}

export default DomainsDeleteChain;
