import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

class RolesCreateChain extends NotificationInterface {
  private snapshot: any;
  private docRef: any;
  private creator: any;
  private creatorRef: any;

  constructor(snapshot: any) {
    super("roles", "/topics/roles");
    this.snapshot = snapshot;
    this.docRef = snapshot.data();
    this.creatorRef = snapshot.data().creator;
    this.creator = "";
  }

  private async fetchCreatorDetails() {
    this.creator = await new FirestoreService()
        .getUserByUid(this.creatorRef);
    return this;
  }


  async updateSnapshot() {
    await this.fetchCreatorDetails();
    await this.snapshot.ref.update({
      creator: this.creator,
    });
    return this;
  }

  async updateDependency() {
    await new FirestoreService()
        .updateDependency(this.moduleName, "create", this.snapshot.id);
    return this;
  }

  async notify() {
    const fullname = this.creator.firstname + " "+ this.creator.lastname;
    const item = this.docRef.name;

    const genericTitle = "Role Create Action!!";
    const genericMessage = `${fullname} added ${item} to role`;

    const permissions =
    await new FirestoreService().getModuleNotificationChannel("roles");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("roles", this.snapshot)).create();
    return this;
  }
}

export default RolesCreateChain;
