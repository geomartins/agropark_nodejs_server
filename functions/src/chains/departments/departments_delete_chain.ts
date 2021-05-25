
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class DepartmentsDeleteChain {
    snapshot: any;
    deleter: any;
    docRef: any;

    constructor(snapshot: any) {
      this.snapshot = snapshot;
      this.deleter = snapshot.data().deleter;
      this.docRef = snapshot.data();
    }


    async updateConfiguration() {
      await new FirestoreService()
          .updateConfigurations("departments", "delete", this.snapshot.id);
      return this;
    }

    async updateModuleActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateModuleActivities(
              "departments", "delete", "deleted a department ",
              this.deleter, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("departments", this.snapshot)).delete();
      return this;
    }
}

export default DepartmentsDeleteChain;
