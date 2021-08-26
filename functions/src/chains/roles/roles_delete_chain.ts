import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";
class RolesDeleteChain extends NotificationInterface {
  private docRef: any;
  deleterRef: any;
  deleter: any;

  constructor(protected snapshot: any) {
    super("roles", "/topics/roles");
    this.docRef = this.snapshot.data();
    this.deleter = snapshot.data().deleter;
  }


  async updateDependency() {
    await new FirestoreService()
        .updateDependency(this.moduleName, "delete", this.snapshot.id);
    return this;
  }

  async notify() {
    const fullname = this.deleter;
    const item = this.docRef.name;


    const genericTitle = "Role Delete Action!!";
    const genericMessage =
    `${fullname} deleted ${item} from role`;

    const permissions =
    await new FirestoreService().getModuleNotificationChannel("roles");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }


  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("roles", this.snapshot)).delete();
    return this;
  }
}

export default RolesDeleteChain;
