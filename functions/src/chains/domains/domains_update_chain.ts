import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * The purpose of this class is to facilate creating of domain
 * updating dependencies, updating snapshot, send notification
 * to the app once it done and updating angolia
 * @class
 * @extends NotificationInterface
 */
class DomainsUpdateChain extends NotificationInterface {
  snapshot: any;
  afterData: any;
  beforeData: any;
  docRef: any;
  editorRef: any;
  editor: any;
  status: boolean;
  constructor(snapshot: any) {
    super("domains", "/topics/domains");
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

  async notify() {
    const fullname = this.editor.firstname + " "+ this.editor.lastname;
    const item = this.docRef.name;

    const genericTitle = "Domain Update Action!!";
    const genericMessage = `${fullname} updated ${item} domain`;


    const permissions =
    await new FirestoreService().getModuleNotificationChannel("domains");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }


  async updateAngolia() {
  /** Updating Algolia */
    (await new AlgoliaService("domains", this.snapshot)).update();
    return this;
  }
}

export default DomainsUpdateChain;
