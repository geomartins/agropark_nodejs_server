import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
 */
class ModulesDeleteChain extends NotificationInterface {
  private docRef: any;
  deleterRef: any;
  deleter: any;

  constructor(protected snapshot: any, private readonly moduleId: string) {
    super("modules", "/topics/modules");
    this.docRef = this.snapshot.data();
    this.moduleId = moduleId;
    this.deleter = snapshot.data().deleter;
  }


  async updateDependency() {
    await new FirestoreService()
        .updateDependency(this.moduleName, "delete", this.snapshot.id);
    await this.updateDependencies();
    return this;
  }

  private async updateDependencies() {
    const newValue = {name: this.docRef.name, alt_name: this.docRef.alt_name,
      category: this.docRef.category};
    const oldValue = {};
    await new FirestoreService()
        .updateRoleModuleDependencies("delete",
            this.moduleId, newValue, oldValue );
    return this;
  }

  async notify() {
    const fullname = this.deleter;
    const item = this.docRef.name;


    const genericTitle = "Module Delete Action!!";
    const genericMessage =
    `${fullname} deleted ${item} from module`;

    const permissions =
    await new FirestoreService().getModuleNotificationChannel("modules");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }


  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("modules", this.snapshot)).delete();
    return this;
  }
}

export default ModulesDeleteChain;
