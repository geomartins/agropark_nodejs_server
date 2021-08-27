import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import AuthenticationService from "../../services/authentication_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
 */
class UsersUpdateChain extends NotificationInterface {
    snapshot: any;
    afterData: any;
    beforeData: any;
    docRef: any;
    editorRef: any;
    editor: any;
    status: boolean;
    constructor(snapshot: any) {
      super("users", "/topics/users");
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

    async updateCustomClaims() {
      if ( this.beforeData.role != this.afterData.role) {
        const role = this.docRef.role;
        const uid = this.snapshot.after.id;
        await new AuthenticationService().updateCustomClaims(uid, role);
      }
      return this;
    }
    async updateDisplayName() {
      if ( (this.beforeData.firstname != this.afterData.firstname) ||
     (this.beforeData.lastname != this.afterData.lastname)) {
        const uid = this.snapshot.after.id;
        const fullname = this.docRef.firstname+" "+this.docRef.lastname;
        await new AuthenticationService().updateDisplayName(uid, fullname);
      }
      return this;
    }

    async updateAvatar() {
      if ( this.beforeData.avatar != this.afterData.avatar ) {
        const uid = this.snapshot.after.id;
        const avatar: string = this.docRef.avatar;
        await new AuthenticationService().updateAvatar(uid, avatar);
      }
      return this;
    }


    async notify() {
      const fullname = this.editor.firstname + " "+ this.editor.lastname;
      const item = this.docRef.firstname + " "+ this.docRef.lastname;

      const genericTitle = "Users Update Action!!";
      const genericMessage =`${fullname} added ${item} to user`;


      const permissions =
      await new FirestoreService().getModuleNotificationChannel("users");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("users", this.snapshot)).update();
      return this;
    }
}

export default UsersUpdateChain;
