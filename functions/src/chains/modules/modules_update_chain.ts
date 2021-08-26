import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

class ModulesUpdateChain extends NotificationInterface {
  snapshot: any;
  afterData: any;
  beforeData: any;
  docRef: any;
  editorRef: any;
  editor: any;
  status: boolean;
  constructor(snapshot: any, private readonly moduleId: string) {
    super("modules", "/topics/modules");
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

    const genericTitle = "Module Update Action!!";
    const genericMessage = `${fullname} updated ${this.docRef.name} module `;


    const permissions =
    await new FirestoreService().getModuleNotificationChannel("modules");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }


  async updateDependencies() {
    const newValue = {
      name: this.afterData.name,
      alt_name: this.afterData.alt_name,
      category: this.afterData.category,
      type: this.afterData.type,
    };
    const oldValue = {name: this.beforeData.name,
      alt_name: this.beforeData.alt_name,
      category: this.beforeData.category,
      type: this.beforeData.type,
    };

    await new FirestoreService()
        .updateRoleModuleDependencies("update",
            this.moduleId, newValue, oldValue );
    return this;
  }

  async updateAngolia() {
  /** Updating Algolia */
    (await new AlgoliaService("modules", this.snapshot)).update();
    return this;
  }
}

export default ModulesUpdateChain;
