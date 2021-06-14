import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class ModulesUpdateChain {
  snapshot: any;
  afterData: any;
  beforeData: any;
  docRef: any;
  editorRef: any;
  editor: any;
  status: boolean;
  constructor(snapshot: any, private readonly moduleId: string) {
    this.snapshot = snapshot;
    this.afterData = snapshot.after.data();
    this.beforeData = snapshot.before.data();
    this.docRef = snapshot.after.data();
    this.editorRef = snapshot.after.data().editor;
    this.editor = "";
    this.status = false;
  }


  get objectStatus() {
    return this.status;
  }

  async verifyIfDocIsEdited() {
    if (typeof this.afterData.editor == "string") {
      this.status = true;
    }
    return this;
  }

  private async fetchUserDetails() {
    this.editor = await new FirestoreService()
        .getUserByUid(this.editorRef);
    return this;
  }

  async updateSnapshot() {
    await this.fetchUserDetails();
    await this.snapshot.after.ref.update({editor: this.editor});
    // await this.fetchUserDetails();
    return this;
  }

  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("modules", "update",
            this.snapshot.after.id);

    return this;
  }

  async updateDependencies() {
    const newValue = {name: this.afterData.name,
      category: this.afterData.category};
    const oldValue = {name: this.beforeData.name,
      category: this.beforeData.category};

    await new FirestoreService()
        .updateRoleModuleDependencies("update",
            this.moduleId, newValue, oldValue );
    return this;
  }


  async updateActivities() {
    this.docRef.id = this.snapshot.after.id;
    await new FirestoreService()
        .updateActivities(
            "modules", "update", "updated a module",
            this.editor, this.docRef);
    return this;
  }


  async updateAngolia() {
  /** Updating Algolia */
    (await new AlgoliaService("modules", this.snapshot)).update();
    return this;
  }
}

export default ModulesUpdateChain;
