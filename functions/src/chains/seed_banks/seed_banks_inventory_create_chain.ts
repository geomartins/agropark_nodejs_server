import FirestoreService from "../../services/firestore_service";
import PushyService from "../../services/pushy_service";

class SeedBanksInventoryCreateChain {
    private snapshot: any;
    private docRef: any;
    private creatorRef: any;
    private creator: any;
    // private readonly seedBankId: string;

    constructor(snapshot: any, seedBankId: string) {
      this.snapshot = snapshot;
      this.docRef = snapshot.data();
      this.creatorRef = snapshot.data().creator;
      this.creator = "";
      // this.seedBankId = seedBankId;
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

    async updatePushy() {
      const fullname = this.creator.firstname + " "+ this.creator.lastname;
      const cropType = this.docRef.module_refs.name +
      " "+this.docRef.module_refs.category;
      const quantity = this.docRef.quantity;
      const type = this.docRef.type == "add" ? "added" : "removed";
      const pro = this.docRef.type == "add" ? "to" : "from";

      const title = "SeedBank-Inventory Create Action!!";
      const message =
      `${fullname} ${type} ${quantity} item(s) ${pro} ${cropType} inventory`;
      const topic = "/topics/seed_banks";
      const data = {title: title, message: message};

      new FirestoreService().updateModuleNotifier("seed_banks", data );
      new PushyService().pushToTopics(topic,
          data, {});

      return this;
    }

    async updateActivities() {
      this.docRef.id = this.snapshot.id;
      await new FirestoreService()
          .updateActivities(
              "seed_banks", "create", "created a new seed_banks-inventory",
              this.creator, this.docRef );
      return this;
    }
}

export default SeedBanksInventoryCreateChain;
