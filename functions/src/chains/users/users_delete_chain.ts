import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";
class UsersDeleteChain extends NotificationInterface {
  private docRef: any;
  private deleter: any;


  constructor(protected snapshot: any) {
    super("users", "/topics/users");
    this.docRef = this.snapshot.data();
    this.deleter = "";
  }

  async updateDependency() {
    await new FirestoreService()
        .updateDependency(this.moduleName, "delete", this.snapshot.id);
    return this;
  }


  async notify() {
    const fullname = this.deleter;
    const item = this.docRef.firstname+ " "+ this.docRef.lastname;

    const genericTitle = "Module Delete Action!!";
    const genericMessage =
    `${fullname} deleted ${item} account from users`;

    const permissions =
    await new FirestoreService().getModuleNotificationChannel("users");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("users", this.snapshot)).delete();
    return this;
  }
}

export default UsersDeleteChain;
