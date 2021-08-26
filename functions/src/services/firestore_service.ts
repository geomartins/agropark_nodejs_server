import * as admin from "firebase-admin";

const timestamp = admin.firestore.FieldValue.serverTimestamp();

type RoleModuleDependencyValue =
{ name: string; alt_name: string; category: string; } | {};

class FirestoreService {
  constructor() {}
  async getObjectByUid(name: string, uid: string) {
    return admin.firestore().collection(name).doc(uid).get();
  }

  async updateDependency(module_name: string, type: string, id: string) {
    if (type == "create") {
      return admin.firestore().collection("dependencies").doc(module_name).set({
        ids: admin.firestore.FieldValue.arrayUnion(id),
      }, {merge: true});
    }

    if (type == "delete") {
      return admin.firestore().collection("dependencies").doc(module_name).set({
        ids: admin.firestore.FieldValue.arrayRemove(id),
      }, {merge: true});
    }
    return;
  }

  async updateGeolocationByUid(uid: string, obj: any) {
    await admin.firestore().collection("users")
        .doc(uid).update({geolocation: obj});
  }

  async getModuleNotificationChannel(name: string) {
    const doc = await admin.firestore()
        .collection("modules").doc(name).get();
    if (doc.exists) {
      console.log("log exist");
      return {
        inApp: doc.data()?.app_channel,
        slack: doc.data()?.slack_channel,
        sms: doc.data()?.sms_channel,
        pushy: doc.data()?.pushy_channel,
        mail: doc.data()?.mail_channel,
        whatzapp: doc.data()?.whatzapp_channel,
      };
    } else {
      console.log("Nopeeeeeee");
      return {
        slack: "",
        sms: "",
        pushy: true,
        inApp: true,
        mail: "",
        whatzapp: "",
      };
    }
  }

  async updateModuleNotifier(name: string,
      data: {title: string; message: string} ) {
    // Get Role associated with the module
    admin.firestore().collection("modules")
        .doc(name).get().then((doc) => {
          if (doc.exists) {
            const roles_ref: string[] = doc.data()?.roles_ref ?? [];
            doc.ref.collection("notifiers").add({
              ...data,
              ref: "modules", // refering the parent
              roles: roles_ref,
              unvisited_roles: roles_ref,
              visited_ids: [],
              module: name,
              timestamp: timestamp,
            });
          }
        });
  }

  async updateExtensionNotifier(name:string,
      data: {title: string; message: string}, ids: string[] ) {
    await admin.firestore().collection("extensions").add({
      ...data,
      ref: "extensions", // refering the parent collection name
      ids: ids,
      unvisited_ids: ids,
      visited_ids: [],
      extension: name,
      timestamp: timestamp,
    });

    return;
  }
  async updateModulesCollectionRoleRef(type: string,
      module: string, role: string) {
    if (type == "create") {
      await admin.firestore().collection("modules").doc(module).update({
        roles_ref: admin.firestore.FieldValue.arrayUnion(role),
      });
    }

    if (type == "delete") {
      await admin.firestore().collection("modules").doc(module).update({
        roles_ref: admin.firestore.FieldValue.arrayRemove(role),
      });
    }

    return;
  }

  async updateRoleExtensionDependencies(type: string, extensionId: string,
      oldValue: RoleModuleDependencyValue,
      newValue: RoleModuleDependencyValue) {
    if (type == "delete") {
      await admin.firestore().collection("roles")
          .where("extensions_ref", "array-contains", oldValue)
          .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update(
                  {extensions_ref:
                        admin.firestore.FieldValue.arrayRemove(oldValue),
                  });
            });
          });

      return;
    }

    return;
  }

  async updateRoleModuleDependencies(type: string, moduleId: string,
      oldValue: RoleModuleDependencyValue,
      newValue: RoleModuleDependencyValue) {
    // if (type == "update") {
    //   await admin.firestore().collectionGroup("modules")
    //       .where("name", "==", moduleId).get().then((querySnapshot) => {
    //         if (!querySnapshot.empty) {
    //           return;
    //         }
    //         querySnapshot.forEach((doc) => {
    //           doc.ref.update(newValue);
    //         });
    //       });
    // }

    if (type == "delete") {
      await admin.firestore().collection("roles")
          .where("modules_ref", "array-contains", oldValue)
          .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update(
                  {modules_ref:
                    admin.firestore.FieldValue.arrayRemove(oldValue),
                  });
            });
          });

      return;
    }

    return;

    // db.collectionGroup('landmarks')
  }
  async updateRoleModuleRef(type: string, roleId: string,
      obj: {name: string; alt_name: string; category: string; },
      oldObj?:{ name: string; alt_name: string;
        category: string; }) {
    if (type == "create") {
      admin.firestore().collection("roles").doc(roleId)
          .get().then((doc) => {
            if (doc.exists) {
              doc.ref.update({
                modules_ref: admin.firestore.FieldValue.arrayUnion(obj),
              });
            }
          });
    }

    if (type == "delete") {
      admin.firestore().collection("roles").doc(roleId)
          .get().then((doc) => {
            if (doc.exists) {
              console.log(obj, "yes ooo");
              doc.ref.update({
                modules_ref: admin.firestore.FieldValue.arrayRemove(obj),
              });
            }
          });
    }


    if (type == "update") {
      admin.firestore().collection("roles").doc(roleId)
          .get().then((doc) => {
            if (doc.exists) {
              const modules_ref = doc?.data()?.modules_ref;
              const index = modules_ref.indexOf(oldObj); // remove the obj
              modules_ref.splice(index, 1);
              modules_ref.push(obj);
              doc.ref.update({
                modules_ref: [...new Set(modules_ref)],
              });
            }
          });
    }


    return null;
  }


  async updateRoleExtensionRef(type: string, roleId: string,
      obj: {name: string; alt_name: string; category: string; },
      oldObj?:{ name: string; alt_name: string;
      category: string; }) {
    if (type == "create") {
      admin.firestore().collection("roles").doc(roleId)
          .get().then((doc) => {
            if (doc.exists) {
              doc.ref.update({
                extensions_ref: admin.firestore.FieldValue.arrayUnion(obj),
              });
            }
          });
    }

    if (type == "delete") {
      admin.firestore().collection("roles").doc(roleId)
          .get().then((doc) => {
            if (doc.exists) {
              doc.ref.update({
                extensions_ref: admin.firestore.FieldValue.arrayRemove(obj),
              });
            }
          });
    }


    if (type == "update") {
      admin.firestore().collection("roles").doc(roleId)
          .get().then((doc) => {
            if (doc.exists) {
              const extensions_ref = doc?.data()?.extensions_ref;
              const index = extensions_ref.indexOf(oldObj); // remove the obj
              extensions_ref.splice(index, 1);
              extensions_ref.push(obj);
              doc.ref.update({
                extensions_ref: [...new Set(extensions_ref)],
              });
            }
          });
    }


    return null;
  }

  async getTopicsByUid(uid: string) {
    const userData = await this.getUserByUid(uid);
    if (!userData) {
      return [];
    }
    return admin.firestore().collection("roles")
        .doc(userData.role).get().then((doc) => {
          if (doc.exists) {
            const topics: string[] = [];
            const modules_ref: [{name: string; category: string}] =
             doc.data()?.modules_ref;
            for (const mod of modules_ref) {
              topics.push(mod.name);
            }
            return topics;
          } else {
            return [];
          }
        });
  }

  async updateUserDeviceToken(uid: string, deviceToken: string) {
    let status = false;
    return admin.firestore().collection("users").where("device_tokens",
        "array-contains", deviceToken).get().then((querySnapshot)=> {
      querySnapshot.forEach((doc) => {
        if (doc.id == uid) {
          status = true;
        } else {
          doc.ref.update({device_tokens:
              admin.firestore.FieldValue.arrayRemove(deviceToken)});
        }
      });
    }).then(()=> {
      if (status == false) {
        admin.firestore().collection("users").doc(uid).update({
          device_tokens: admin.firestore.FieldValue.arrayUnion(deviceToken),
        });
      }
    }).catch((err) => {
      return;
    });
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

  async getModuleByUid(uid: string) {
    return await admin.firestore().collection("modules")
        .doc(uid).get().then((doc) => {
          const result = {
            category: doc?.data()?.category,
            name: doc?.data()?.name,
            alt_name: doc?.data()?.alt_name,
          };
          return result;
        }).catch((err) => console.log(err));
  }

  async getExtensionByUid(uid: string) {
    return await admin.firestore().collection("extensions")
        .doc(uid).get().then((doc) => {
          const result = {
            category: doc?.data()?.category,
            name: doc?.data()?.name,
            alt_name: doc?.data()?.alt_name,

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

  async updateActivities(
      module: string,
      action: string,
      activity: string,
      author: any,
      docRef: any, notify_roles = []) {
    return admin.firestore().collection("activities").doc().create({
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
              doc.ref.update({
                ids: admin.firestore.FieldValue.arrayUnion(id),
              });
            }
          });
    }


    if (type == "delete") {
      admin.firestore().collection("configurations").
          doc(docId).get().then((doc) => {
            if (doc.exists) {
              doc.ref.update({
                ids: admin.firestore.FieldValue.arrayRemove(id),
              });
            }
          });
    }

    return null;
  }


  async fetchExpiringDomainSnapshot(expiryDate: any) {
    return await admin.firestore().collection("domains")
        .where("expiry_date", "<=", expiryDate)
        .orderBy("expiry_date", "desc")
        .get();
  }
}


export default FirestoreService;
