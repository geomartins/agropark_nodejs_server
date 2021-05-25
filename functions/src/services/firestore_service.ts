import * as admin from "firebase-admin";
const timestamp = admin.firestore.FieldValue.serverTimestamp();
class FirestoreService {
  constructor() {}
  async getObjectByUid(name: string, uid: string) {
    return admin.firestore().collection(name).doc(uid).get();
  }

  async getUserByUid(uid: string | {id: string}) {
    uid = typeof uid == "string" ? uid : uid.id;
    return await admin.firestore().collection("users")
        .doc(uid).get().then((doc) => {
          const result = {
            firstname: doc?.data()?.firstname,
            middlename: doc?.data()?.middlename,
            lastname: doc?.data()?.lastname,
            id: doc.id,
            role: doc.data()?.role,
          };
          return result;
        }).catch((err) => console.log(err));
  }

  async getModuleCategoryById(categoryId: string) {
    return admin.firestore().collection("module_categories")
        .doc(categoryId).get().then((doc) => {
          const result: any = doc.data();
          result.id = doc.id;
          return result;
        }).catch((err) => console.log(err));
  }

  async updateModuleActivities(
      module: string,
      action: string,
      activity: string,
      author: string | any,
      docRef: any, notify_roles = []) {
    return admin.firestore().collection("module_activities").doc().create({
      module: module,
      action: action,
      activity: activity,
      author: author,
      timestamp: timestamp,
      docRef: docRef,
      notify_roles: notify_roles,
    });
  }

  async updateConfigurations(docId: string, type: string, id: string) {
    if (type == "create") {
      admin.firestore().collection("configurations").doc(docId)
          .get().then((doc) => {
            if (doc.exists) {
              const ids = doc.data()?.ids ? doc.data()?.ids : [];
              ids.push(id);
              doc.ref.update({
                ids: [...new Set(ids)],
              });
            } else {
              doc.ref.set({
                ids: [id],
              }, {merge: true});
            }
          });
    }


    if (type == "delete") {
      admin.firestore().collection("configurations").
          doc(docId) .get().then((doc) => {
            if (doc.exists) {
              const ids = doc?.data()?.ids;
              const index = ids.indexOf(id); // remove the id
              ids.splice(index, 1);
              doc.ref.update({
                ids: [...new Set(ids)],
              });
            }
          });
    }

    return null;
  }
}


export default FirestoreService;
