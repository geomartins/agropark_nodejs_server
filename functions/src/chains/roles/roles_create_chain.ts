import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";

class RolesCreateChain {
  private snapshot: any;
  private docRef: any;
  private creator: any;
  private creatorRef: any;

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
        .updateConfigurations("roles", "create", this.snapshot.id);
    return this;
  }

  async updateActivities() {
    this.docRef.id = this.snapshot.id;
    await new FirestoreService()
        .updateActivities(
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
