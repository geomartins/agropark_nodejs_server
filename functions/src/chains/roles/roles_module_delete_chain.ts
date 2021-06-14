import FirestoreService from "../../services/firestore_service";

class RolesModuleDeleteChain {
  private snapshot: any;
  private docRef: any;

  constructor(snapshot: any, private roleId: string) {
    this.snapshot = snapshot;
    this.docRef = this.snapshot.data();
  }

  async updateRoleModuleRef() {
    // This will update modules_ref
    await new FirestoreService()
        .updateRoleModuleRef("delete", this.roleId,
            {"name": this.docRef.name, "category": this.docRef.category});
    return this;
  }
}

export default RolesModuleDeleteChain;
