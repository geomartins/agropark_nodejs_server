import FirestoreService from "../../services/firestore_service";
import PushyService from "../../services/pushy_service";

/**
 * @class
 */
class SeedBanksInventoryUpdateChain {
  private snapshot: any;
  private afterData: any;
  // private beforeData: any;
  private docRef: any;
  private editorRef: any;
  private editor: any;
  private status: boolean;
  constructor(snapshot: any) {
    this.snapshot = snapshot;
    this.afterData = snapshot.after.data();
    // this.beforeData = snapshot.before.data();
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
    return this;
  }

  async updateActivities() {
    this.docRef.id = this.snapshot.after.id;
    await new FirestoreService()
        .updateActivities(
            "seed_banks", "update", "updated a seed_bank inventory",
            this.editor, this.docRef);
    return this;
  }

  async updatePushy() {
    const fullname = this.editor.firstname + " "+ this.editor.lastname;
    const cropType = this.docRef.module_refs.name +
    " "+this.docRef.module_refs.category;

    const title = "SeedBank-Inventory Update Action!!";
    const message = `${fullname} updated  ${cropType} inventory`;
    const topic = "/topics/seed_banks";
    const data = {title: title, message: message};

    new FirestoreService().updateModuleNotifier("seed_banks", data );
    new PushyService().pushToTopics(topic, data, {});
    return this;
  }
}

export default SeedBanksInventoryUpdateChain;
