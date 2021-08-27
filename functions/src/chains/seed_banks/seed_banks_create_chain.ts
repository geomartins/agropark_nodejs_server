

import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
 */
class SeedBanksCreateChain extends NotificationInterface {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;

    constructor(snapshot: any) {
      super("seed_banks", "/topics/seed_banks");
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
      const cropType = this.docRef.name + " "+this.docRef.category;

      const genericTitle = "SeedBank Create Action!!";
      const genericMessage = `${fullname} added ${cropType} to seedbank`;

      const permissions =
      await new FirestoreService().getModuleNotificationChannel("seed_banks");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();

      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService(this.moduleName, this.snapshot)).create();
      return this;
    }
}

export default SeedBanksCreateChain;
