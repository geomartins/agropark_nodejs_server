
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import PushyService from "../../services/pushy_service";

/**
 * @class
 */
class FeedbacksDeleteChain {
  constructor(protected snapshot: any) {}


  async updatePushy() {
    const title = "Feedback Delete Action!!!!";
    const message = "Item was deleted from feedback";
    const topic = "/topics/feedbacks";
    const data = {title: title, message: message};

    // Notifier
    new FirestoreService().updateModuleNotifier("feedbacks", data );
    // Pushy
    new PushyService().pushToTopics(topic, data, {});

    return this;
  }

  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("feedbacks", this.snapshot)).delete();
    return this;
  }
}

export default FeedbacksDeleteChain;
