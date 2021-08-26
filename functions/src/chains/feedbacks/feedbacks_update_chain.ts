import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import PushyService from "../../services/pushy_service";

class FeedbacksUpdateChain {
  snapshot: any;
  afterData: any;
  beforeData: any;
  docRef: any;
  editorRef: any;
  editor: any;
  status: boolean;
  constructor(snapshot: any) {
    this.snapshot = snapshot;
    this.afterData = snapshot.after.data();
    this.beforeData = snapshot.before.data();
    this.docRef = snapshot.after.data();
    this.editorRef = snapshot.after.data().editor;
    this.editor = "";
    this.status = false;
  }


  get objectStatus() {
    return this.status;
  }

  async verifyIfDocIsEdited() {
    if (typeof this.afterData.editor == "string") {
      this.status = true;
    }
    return this;
  }

  private async fetchUserDetails() {
    this.editor = await new FirestoreService()
        .getUserByUid(this.editorRef);
    return this;
  }

  async updateSnapshot() {
    await this.fetchUserDetails();
    await this.snapshot.after.ref.update({editor: this.editor});
    return this;
  }

  async updatePushy() {
    const fullname = this.editor.firstname + " "+this.editor.lastname;

    const title = "Feedback Update Action!!";
    const message = `${fullname} updated feedback `;
    const topic = "/topics/feedbacks";
    const data = {title: title, message: message};

    new FirestoreService().updateModuleNotifier("feedbacks", data );
    new PushyService().pushToTopics(topic,
        data, {});
    return this;
  }


  async updateAngolia() {
  /** Updating Algolia */
    (await new AlgoliaService("feedbacks", this.snapshot)).update();
    return this;
  }
}

export default FeedbacksUpdateChain;
