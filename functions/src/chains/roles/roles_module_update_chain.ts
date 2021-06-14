import FirestoreService from "../../services/firestore_service";

class RolesModuleUpdateChain {
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
    // await this.fetchUserDetails();
    return this;
  }

  //   async updateRoleModuleRef() {
  //     // This will update modules_ref
  //     const obj = {name: this.afterData.name,
  // category: this.afterData.category};
  //     const oldObj = {name: this.beforeData.name,
  //       category: this.beforeData.category};

  //     console.log("Iniiiiiiiiiiiiiiiiiiiiiiii");

  //     await new FirestoreService()
  //         .updateRoleModuleRef("update", this.roleId,
  //             obj, oldObj);
  //     return this;
  //   }


  async updateActivities() {
    this.docRef.id = this.snapshot.after.id;
    await new FirestoreService()
        .updateActivities(
            "roles", "update", "updated a roles-module",
            this.editor, this.docRef);
    return this;
  }
}

export default RolesModuleUpdateChain;
