import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class RolesDeleteChain {
  private snapshot: any;

  constructor(snapshot: any) {
    this.snapshot = snapshot;
  }


  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("roles", "delete", this.snapshot.id);
    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("roles", this.snapshot)).delete();
    return this;
  }
}

export default RolesDeleteChain;
