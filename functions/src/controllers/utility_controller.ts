import * as admin from "firebase-admin";
import AlgoliaService from "../services/algolia_service";
import FirestoreService from "../services/firestore_service";
import PushyService from "../services/pushy_service";
import GeolocationService from "../services/geolocation_service";

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @async
 */
export const fetchModuleRefs = async (req: any, res: any, next: any) => {
  const role = req.body.role;
  const uid = req.info.uid;
  new GeolocationService().update(uid);

  admin.firestore().collection("roles")
      .doc(role).get().then((docRef)=> {
        if (docRef.exists) {
          const modules = docRef.data()?.modules_ref ?? [];
          const extensions = docRef.data()?.extensions_ref ?? [];
          const result = [...modules, ...extensions];

          return res.status(200).json(result);
        } else {
          return res.status(200).json([]);
        }
      });
};

/**
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next next
 * @return {any}
 */
export const search = async (req: any, res: any, next: any) => {
  try {
    const name = req.body.name;
    const input = req.body.input;
    const result = await AlgoliaService.search(name, input);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(200).json([]);
    }
  } catch (err: any) {
    next(err);
  }
  return;
};

/**
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next next
 * @async
 * @return {any}
 */
export const moduleNotifierCleaner = async (req: any, res: any, next: any) => {
  try {
    const role = req.body.role;
    const module_name = req.body.module_name;
    const uid = req.info.uid;

    await admin.firestore().collectionGroup("notifiers")
        .where("ref", "==", "modules")
        .where("module", "==", module_name)
        .where("unvisited_roles", "array-contains", role)
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
            doc.ref.update({
              unvisited_roles: admin.firestore.FieldValue.arrayRemove(role),
              visited_ids: admin.firestore.FieldValue.arrayUnion(uid),
            });
          });
        });
    return res.status(200).json({message: "successfully"});
  } catch (err: any) {
    next(err);
  }
};


/**
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next next
 * @async
 * @return {any}
 */
export const subscribeTopicsToDevice =
async (req: any, res: any, next: any) => {
  try {
    const deviceToken = req.body.deviceToken;
    const uid = req.info.uid;

    // Update User Device Token
    await new FirestoreService().updateUserDeviceToken(uid, deviceToken);

    // Unsubscribe Old Topic
    await new PushyService().unsubscribeOldTopics(deviceToken);

    // Get Topics
    const topics = await new FirestoreService().getTopicsByUid(uid);
    if (topics) {
    // Subscribe New Topic
      await new PushyService().subscribe(deviceToken, topics);
    }

    return res.status(200).json({message: "device subscribed to topic"});
  } catch (err: any) {
    return next(err);
  }
};
