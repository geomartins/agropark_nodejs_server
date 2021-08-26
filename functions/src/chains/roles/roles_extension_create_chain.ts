import FirestoreService from "../../services/firestore_service";
import NotificationInterface from "../../interfaces/notification";

class RolesExtensionCreateChain extends NotificationInterface {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;
    private category: string;
    private readonly roleId: string;
    private alt_name: string;

    constructor(snapshot: any, roleId: string) {
      super("roles", "/topics/roles");
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.category = "";
      this.creator = "";
      this.alt_name = "";
      this.roleId = roleId;
    }

    private async fetchCreatorDetails() {
      this.creator = await new FirestoreService()
          .getUserByUid(this.creatorRef);
      return this;
    }

    async fetchExtensionCategory() {
      const result = await new FirestoreService()
          .getExtensionByUid(this.docRef.name);

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

    async updateRoleExtensionRef() {
      // This will update extensions_ref
      await new FirestoreService()
          .updateRoleExtensionRef("create", this.roleId,
              {"name": this.docRef.name, "category": this.category,
                "alt_name": this.alt_name});
      return this;
    }

    async notify() {
      const fullname = this.creator.firstname + " "+ this.creator.lastname;

      const genericTitle = "Role Extension Create Action!!";
      const genericMessage =
      `${fullname} added ${this.docRef.name }  to ${this.roleId} `;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("roles");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }
}

export default RolesExtensionCreateChain;
