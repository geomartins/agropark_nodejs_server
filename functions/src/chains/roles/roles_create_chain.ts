import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class RolesCreateChain {
  snapshot: any;
  docRef: any;
  creator: any;
  creatorRef: any;

  constructor(snapshot: any) {
    this.snapshot = snapshot;
    this.docRef = snapshot.data();
    this.creatorRef = snapshot.data().creator;
    this.creator = "";
  }

  async fetchCreatorDetails() {
    this.creator = await new FirestoreService()
        .getUserByUid(this.creatorRef);
    return this;
  }


  async updateSnapshot() {
    await this.snapshot.ref.update({
      creator: this.creator,
    });
    return this;
  }

  async updateConfiguration() {
    await new FirestoreService()
        .updateConfigurations("roles", "create", this.snapshot.id);
    return this;
  }

  async updateModuleActivities() {
    this.docRef.id = this.snapshot.id;
    await new FirestoreService()
        .updateModuleActivities(
            "roles", "create", "created a new role",
            this.creator, this.docRef );
    return this;
  }

  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("roles", this.snapshot)).create();
    return this;
  }
}

export default RolesCreateChain;
