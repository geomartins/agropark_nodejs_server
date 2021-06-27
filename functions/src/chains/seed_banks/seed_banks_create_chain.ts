

import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import PushyService from "../../services/pushy_service";

class SeedBanksCreateChain {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;


    constructor(snapshot: any) {
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

    async updateConfiguration() {
      await new FirestoreService()
          .updateConfigurations("seed_banks", "create", this.snapshot.id);
      return this;
    }

    async updatePushy() {
      const fullname = this.creator.firstname + " "+ this.creator.lastname;
      const cropType = this.docRef.name + " "+this.docRef.category;
      const topic = "/topics/seed_banks";
      const data = {
        title: "SeedBank Create Action!!",
        message: `${fullname} added ${cropType} to seedbank`,
      };

      // Notifier
      new FirestoreService().updateModuleNotifier("seed_banks", data );
      // Pushy
      new PushyService().pushToTopics(topic, data, {});
      return this;
    }


    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "seed_banks", "create", "created a new seed bank",
              this.creator, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("seed_banks", this.snapshot)).create();
      return this;
    }
}

export default SeedBanksCreateChain;
