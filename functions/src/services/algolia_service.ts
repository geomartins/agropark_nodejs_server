import algoliasearch from "algoliasearch";
import * as functions from "firebase-functions";

const client = algoliasearch(functions.config().algolia.app_id,
    functions.config().algolia.key);

class AlgoliaService {
    name: string;
    snapshot: any;
    constructor(name: string, snapshot: any) {
      this.name = name; // eg users, tickets
      this.snapshot = snapshot;
    }

    async create() {
      const data = this.snapshot.data();
      data.objectID = this.snapshot.id;
      const index = client.initIndex(this.name);
      return index.saveObject(data);
    }

    async update() {
      const data = this.snapshot.after.data();
      data.objectID = this.snapshot.after.id;
      const index = client.initIndex(this.name);
      return index.saveObject(data);
    }

    async delete() {
      const id = this.snapshot.id;
      const index = client.initIndex(this.name);
      return index.deleteObject(id);
    }
}


export default AlgoliaService;
