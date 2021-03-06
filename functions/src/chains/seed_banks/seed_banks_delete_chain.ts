
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import PushyService from "../../services/pushy_service";

/**
 * @class
 */
class SeedBanksDeleteChain {
  constructor(protected snapshot: any) {}


  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("seed_banks", "delete", this.snapshot.id);
    return this;
  }

  async updatePushy() {
    const title = "SeedBank Delete Action!!!!";
    const message = "Item was deleted from seedbank";
    const topic = "/topics/seed_banks";
    const data = {title: title, message: message};

    // Notifier
    new FirestoreService().updateModuleNotifier("seed_banks", data );
    // Pushy
    new PushyService().pushToTopics(topic, data, {});

    return this;
  }

  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("seed_banks", this.snapshot)).delete();
    return this;
  }
}

export default SeedBanksDeleteChain;
