import FirestoreService from "../../services/firestore_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
 */
class RolesExtensionDeleteChain extends NotificationInterface {
  private snapshot: any;
  private docRef: any;
  private deleter: any;

  constructor(snapshot: any, private roleId: string) {
    super("roles", "/topics/roles");
    this.snapshot = snapshot;
    this.docRef = this.snapshot.data();
    this.deleter = this.docRef.deleter;
  }

  async updateRoleExtensionRef() {
    // This will update modules_ref
    await new FirestoreService()
        .updateRoleExtensionRef("delete", this.roleId,
            {"name": this.docRef.name, "category": this.docRef.category,
              "alt_name": this.docRef.alt_name});
    return this;
  }

  async notify() {
    const fullname = this.deleter;
    const item = this.docRef.name;

    const genericTitle = "Role Extension Delete Action!!";
    const genericMessage =
      `${fullname} removed ${item } extension from ${this.roleId} role`;


    const permissions =
    await new FirestoreService().getModuleNotificationChannel("roles");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }
}

export default RolesExtensionDeleteChain;
