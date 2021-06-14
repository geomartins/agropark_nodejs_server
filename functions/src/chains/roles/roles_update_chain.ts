import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class RolesUpdateChain {
  private snapshot: any;
  private afterData: any;
  private docRef: any;
  private editorRef: any;
  private editor: any;
  private status: boolean;
  constructor(snapshot: any) {
    this.snapshot = snapshot;
    this.afterData = snapshot.after.data();
    this.docRef = snapshot.after.data();
    this.editorRef = snapshot.after.data().editor;
    this.editor = "";
    this.status = false;
  }


  get objectStatus() : boolean {
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
        .updateConfigurations("roles", "update",
            this.snapshot.after.id);

    return this;
  }

  async updateActivities() {
    this.docRef.id = this.snapshot.after.id;
    await new FirestoreService()
        .updateActivities(
            "roles", "update", "updated a role",
            this.editor, this.docRef);
    return this;
  }


  async updateAngolia() {
  /** Updating Algolia */
    (await new AlgoliaService("roles", this.snapshot)).update();
    return this;
  }
}

export default RolesUpdateChain;
