
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class DepartmentsDeleteChain {
  constructor(protected snapshot: any) {}


  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("departments", "delete", this.snapshot.id);
    return this;
  }

  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("departments", this.snapshot)).delete();
    return this;
  }
}

export default DepartmentsDeleteChain;
