
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

class ModulesCreateChain extends NotificationInterface {
    snapshot: any;
    docRef: any;
    creatorRef: any;
    categoryRef: any;
    creator: any;
    category: any;

    constructor(snapshot: any) {
      super("modules", "/topics/modules");
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.categoryRef = snapshot.data().category;
      this.creator = "";
      this.category = "";
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

      const genericTitle = "Module Create Action!!";
      const genericMessage = `${fullname} added ${item} to module`;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("modules");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }


    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("modules", this.snapshot)).create();
      return this;
    }
}

export default ModulesCreateChain;
