import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * The purpose of this class is to facilate easy updating of domain
 * coupled with sending notification about the update to the app
 * @class
 * @extends NotificationInterface
 * @property { object } snapshot - firestore snapshot object
 * @property { object } afterData - firestore afterData snapshot object
 * @property { object } beforerData - firestore beforeData snapshot object
  * @property { object } docRef - snapshot document reference
  * @property { object } editorRef - editor object
  * @property { string } editor - editor of domain
  *
  *
  *
  * @see {@link FirestoreService}
  * @see {@link AlgoliaService}
  * @see {@link NotificationInterface}

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


  /**
   * This helps confirms if the document has been edited...
   * it returns true if it has been edited..
   *
   * @default false
   * @return {boolean}
   */
  get objectStatus() {
    return this.status;
  }

  /**
   * Helps verify if the doument is updated or not..
   * @async
   * @return {Promise<DomainsUpdateChain>}
   */
  async verifyIfDocIsEdited() {
    if (typeof this.afterData.editor == "string") {
      this.status = true;
    }
    return this;
  }

  /**
   * Help fetch editor details and assigning the result to the
   * @async
   * @private
   * @return {Promise<DomainsUpdateChain>}
   */
  private async fetchUserDetails() {
    this.editor = await new FirestoreService()
        .getUserByUid(this.editorRef);
    return this;
  }

  /**
   * It fetches the current editor details
   *  and update it to the snapshot
   * @async
   * @return {Promise<DomainsUpdateChain>}
   */
  async updateSnapshot() {
    await this.fetchUserDetails();
    await this.snapshot.after.ref.update({editor: this.editor});
    // await this.fetchUserDetails();
    return this;
  }


  /**
   * Helps sends notification to the app
   * informing them of the domain update action
   * @async
   * @public
   * @return {Promise<DomainsUpdateChain>}
   * @see {@link NotificationInterface}
   */
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


  /**
   * Help update domain document in algolia so that
   *  firestore and angolia would be have the same document information
   * @async
   * @public
   * @return {Promise<DomainsUpdateChain>}
   * @see {@link AlgoliaService}
   */
  async updateAngolia() {
  /** Updating Algolia */
    (await new AlgoliaService("domains", this.snapshot)).update();
    return this;
  }
}

export default DomainsUpdateChain;
