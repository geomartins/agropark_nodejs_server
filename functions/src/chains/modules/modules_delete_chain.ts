import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
class ModulesDeleteChain {
  private docRef: any;
  constructor(protected snapshot: any, private readonly moduleId: string) {
    this.docRef = this.snapshot.data();
    this.moduleId = moduleId;
  }


  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("modules", "delete", this.snapshot.id);
    return this;
  }

  async updateDependencies() {
    const newValue = {name: this.docRef.name, category: this.docRef.category};
    const oldValue = {};
    await new FirestoreService()
        .updateRoleModuleDependencies("delete",
            this.moduleId, newValue, oldValue );
    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("modules", this.snapshot)).delete();
    return this;
  }
}

export default ModulesDeleteChain;
