import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import WhoisService from "../../services/whois_service";

class DomainsCreateChain {
    snapshot: any;
    docRef: any;
    creatorRef: any;
    creator: any;
    record: any;

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

    async fetchRecord() {
      const record = await new WhoisService().fetchRecord(this.docRef.name);
      if (record) {
        this.record = record;
      }
      return this;
    }


    async updateSnapshot() {
      await this.fetchCreatorDetails();
      await this.fetchRecord();
      await this.snapshot.ref.update({
        creator: this.creator,
        ...this.record,
      });
      return this;
    }

    async updateConfiguration() {
      await new FirestoreService()
          .updateConfigurations("domains", "create", this.snapshot.id);
      return this;
    }

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "domains", "create", "created a new domain",
              this.creator, this.docRef );
      return this;
    }

    async updateAngolia() {
    /** Updating Algolia */
      (await new AlgoliaService("domains", this.snapshot)).create();
      return this;
    }
}

export default DomainsCreateChain;
