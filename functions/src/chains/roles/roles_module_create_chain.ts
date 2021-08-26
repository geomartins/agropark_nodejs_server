import FirestoreService from "../../services/firestore_service";
import NotificationInterface from "../../interfaces/notification";

class RolesModuleCreateChain extends NotificationInterface {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;
    private category: string;
    private alt_name: string;

    private readonly roleId: string;

    constructor(snapshot: any, roleId: string) {
      super("roles", "/topics/roles");
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.category = "";
      this.alt_name = "";
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
        this.alt_name = result.alt_name;
      } else {
        this.category = "";
        this.alt_name = "";
      }

      return this;
    }


    async updateSnapshot() {
      await this.fetchCreatorDetails();
      await this.snapshot.ref.update({
        creator: this.creator,
        category: this.category,
        alt_name: this.alt_name,
      });
      return this;
    }

    async updateRoleModuleRef() {
      // This will update modules_ref
      await new FirestoreService()
          .updateRoleModuleRef("create", this.roleId,
              {"name": this.docRef.name, "category": this.category,
                "alt_name": this.alt_name});

      await this.updateModulesCollectionRoleRef();

      return this;
    }

    async updateModulesCollectionRoleRef() {
      // This will update modules_ref
      await new FirestoreService()
          .updateModulesCollectionRoleRef("create",
              this.docRef.name, this.roleId);
      return this;
    }

    async notify() {
      const fullname = this.creator.firstname + " "+ this.creator.lastname;

      const genericTitle = "Role Module Create Action!!";
      const genericMessage =
      `${fullname} added ${this.docRef.name }  to ${this.roleId} `;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("roles");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }
}

export default RolesModuleCreateChain;
