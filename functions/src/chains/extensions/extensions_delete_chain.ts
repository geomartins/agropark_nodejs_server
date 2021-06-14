import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
class ExtensionsDeleteChain {
  private docRef: any;
  constructor(protected snapshot: any, private readonly extensionId: string) {
    this.docRef = this.snapshot.data();
    this.extensionId = extensionId;
  }


  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("extensions", "delete", this.snapshot.id);
    return this;
  }

  async updateDependencies() {
    const newValue = {name: this.docRef.name, category: this.docRef.category};
    const oldValue = {};
    await new FirestoreService()
        .updateRoleExtensionDependencies("delete",
            this.extensionId, newValue, oldValue );
    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("extensions", this.snapshot)).delete();
    return this;
  }
}

export default ExtensionsDeleteChain;
