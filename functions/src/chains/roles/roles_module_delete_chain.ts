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
    await this.updateModulesCollectionRoleRef();

    return this;
  }

  async updateModulesCollectionRoleRef() {
    // This will update modules_ref
    await new FirestoreService()
        .updateModulesCollectionRoleRef("delete",
            this.docRef.name, this.roleId);
    return this;
  }
}

export default RolesModuleDeleteChain;
