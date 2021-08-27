import FirestoreService from "../../services/firestore_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
 */
class RolesModuleDeleteChain extends NotificationInterface {
  private snapshot: any;
  private docRef: any;
  private deleter: any;

  constructor(snapshot: any, private roleId: string) {
    super("roles", "/topics/roles");
    this.snapshot = snapshot;
    this.docRef = this.snapshot.data();
    this.deleter = this.docRef.deleter;
  }

  async updateRoleModuleRef() {
    // This will update modules_ref
    await new FirestoreService()
        .updateRoleModuleRef("delete", this.roleId,
            {"name": this.docRef.name, "alt_name": this.docRef.alt_name,
              "category": this.docRef.category});
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

  async notify() {
    const fullname = this.deleter;

    const genericTitle = "Role Module Delete Action!!";
    const genericMessage =
      `${fullname} removed ${this.docRef.name } from ${this.roleId} role `;


    const permissions =
    await new FirestoreService().getModuleNotificationChannel("roles");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }
}

export default RolesModuleDeleteChain;
