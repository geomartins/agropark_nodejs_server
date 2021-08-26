import FirestoreService from "../../services/firestore_service";
import NotificationInterface from "../../interfaces/notification";

class UsersBankUpdateChain extends NotificationInterface {
    snapshot: any;
    afterData: any;
    beforeData: any;
    docRef: any;
    editorRef: any;
    editor: any;
    status: boolean;
    parentId: any;
    parentDocRef: any;

    constructor(snapshot: any, parentId: string) {
      super("users", "/topics/users");
      this.snapshot = snapshot;
      this.afterData = snapshot.after.data();
      this.beforeData = snapshot.before.data();
      this.docRef = snapshot.after.data();
      this.editorRef = snapshot.after.data().editor;
      this.editor = "";
      this.parentId = parentId;
      this.parentDocRef = "";
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
      return this;
    }

    private async fetchParentDetails() {
      this.parentDocRef = await new FirestoreService()
          .getUserByUid(this.parentId);
      return this;
    }


    async notify() {
      await this.fetchParentDetails();
      const fullname = this.editor.firstname + " "+ this.editor.lastname;
      const item = this.parentDocRef.firstname+ " "+ this.parentDocRef.lastname;


      const genericTitle = "Users Bank Update Action!!";
      const genericMessage =`${fullname} updated ${item} bank details`;


      const permissions =
      await new FirestoreService().getModuleNotificationChannel("users");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }
}

export default UsersBankUpdateChain;
