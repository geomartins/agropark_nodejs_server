import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class RolesUpdateChain {
  snapshot: any;
  afterData: any;
  docRef: any;
  user_type: any;
  user: any;
  event: string;
  obj: any;
  obj_status: boolean;

  constructor(snapshot: any) {
    this.snapshot = snapshot;
    this.afterData = snapshot.after.data();
    this.docRef = snapshot.after.data();
    this.user_type = "";
    this.user = "";
    this.event = "";
    this.obj = {};
    this.obj_status = false;
  }

  get objectStatus() {
    return this.obj_status;
  }

  get userType() {
    return this.user_type;
  }

  async verifyUserTypeAndEvent() {
    if (typeof this.afterData.editor == "string") {
      this.user_type = "editor";
      this.event = "update";
    }
    if (typeof this.afterData.deleter == "string") {
      this.user_type = "deleter";
      this.event = "delete";
    }
    return this;
  }

  async fetchUserDetails() {
    this.user = await new FirestoreService()
        .getUserByUid(this.afterData[this.user_type]);
    this.obj[this.user_type] = this.user;
    return this;
  }

  async updateSnapshot() {
    await this.snapshot.after.ref.update(this.obj);
    await this.fetchUserDetails();
    return this;
  }

  async deleteSnapshot() {
    await this.snapshot.after.ref.delete();
    return this;
  }


  async checkObjectStatus() {
    if (Object.keys(this.obj).length === 0) {
      this.obj_status = false;
    } else {
      this.obj_status = true;
    }
    return this;
  }


  async updateConfiguration() {
    const confType = (this.event == "update") ? "create": this.event;
    await new FirestoreService()
        .updateConfigurations("roles", confType,
            this.snapshot.after.id);

    return this;
  }

  async updateModuleActivities() {
    this.docRef.id = this.snapshot.after.id;
    await new FirestoreService()
        .updateModuleActivities(
            "roles", this.event, this.event+"d a role",
            this.user, this.docRef);
    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("roles", this.snapshot)).update();
    return this;
  }
}

export default RolesUpdateChain;
