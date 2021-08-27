import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import PushyService from "../../services/pushy_service";

/**
 * @class
 */
class SeedBanksUpdateChain {
  snapshot: any;
  afterData: any;
  beforeData: any;
  docRef: any;
  editorRef: any;
  editor: any;
  status: boolean;
  constructor(snapshot: any) {
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
        .updateConfigurations("seed_banks", "update",
            this.snapshot.after.id);

    return this;
  }

  async updateActivities() {
    this.docRef.id = this.snapshot.after.id;
    await new FirestoreService()
        .updateActivities(
            "seed_banks", "update", "updated a seed bank",
            this.editor, this.docRef);
    return this;
  }

  async updatePushy() {
    const fullname = this.editor.firstname + " "+this.editor.lastname;
    const cropType = this.beforeData.name + " "+this.beforeData.category;

    const title = "SeedBank Update Action!!";
    const message = `${fullname} updated ${cropType} `;
    const topic = "/topics/seed_banks";
    const data = {title: title, message: message};

    new FirestoreService().updateModuleNotifier("seed_banks", data );
    new PushyService().pushToTopics(topic,
        data, {});
    return this;
  }


  async updateAngolia() {
  /** Updating Algolia */
    (await new AlgoliaService("seed_banks", this.snapshot)).update();
    return this;
  }
}

export default SeedBanksUpdateChain;
