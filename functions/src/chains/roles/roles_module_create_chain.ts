import FirestoreService from "../../services/firestore_service";

class RolesModuleCreateChain {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;
    private category: string;
    private readonly roleId: string;

    constructor(snapshot: any, roleId: string) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.category = "";
      this.creator = "";
      this.roleId = roleId;
    }

    private async fetchCreatorDetails() {
      this.creator = await new FirestoreService()
          .getUserByUid(this.creatorRef);
      return this;
    }

    async fetchModuleCategory() {
      const result = await new FirestoreService()
          .getModuleByUid(this.docRef.name);

      if (result) {
        this.category = result.category;
      } else {
        this.category = "";
      }

      return this;
    }


    async updateSnapshot() {
      await this.fetchCreatorDetails();
      await this.snapshot.ref.update({
        creator: this.creator,
        category: this.category,
      });
      return this;
    }

    async updateRoleModuleRef() {
      // This will update modules_ref
      await new FirestoreService()
          .updateRoleModuleRef("create", this.roleId,
              {"name": this.docRef.name, "category": this.category});
      return this;
    }

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "roles", "create", "created a new roles-module",
              this.creator, this.docRef );
      return this;
    }
}

export default RolesModuleCreateChain;
