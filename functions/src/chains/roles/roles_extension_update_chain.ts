import FirestoreService from "../../services/firestore_service";
import NotificationInterface from "../../interfaces/notification";

class RolesExtensionUpdateChain extends NotificationInterface {
  private snapshot: any;
  private afterData: any;
  // private beforeData: any;
  private docRef: any;
  private editorRef: any;
  private editor: any;
  private status: boolean;
  private parentId: string;
  constructor(snapshot: any, parentId: string) {
    super("roles", "/topics/roles");
    this.snapshot = snapshot;
    this.afterData = snapshot.after.data();
    // this.beforeData = snapshot.before.data();
    this.docRef = snapshot.after.data();
    this.editorRef = snapshot.after.data().editor;
    this.editor = "";
    this.status = false;
    this.parentId = parentId;
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

  async notify() {
    const fullname = this.editor.firstname + " "+ this.editor.lastname;
    const item = this.docRef.name+ "in "+this.parentId;

    const genericTitle = "Role Extension Update Action!!";
    const genericMessage = `${fullname} updated ${item}  role`;


    const permissions =
    await new FirestoreService().getModuleNotificationChannel("roles");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }
}

export default RolesExtensionUpdateChain;
