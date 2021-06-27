import * as admin from "firebase-admin";
import AlgoliaService from "../services/algolia_service";
import FirestoreService from "../services/firestore_service";
import PushyService from "../services/pushy_service";

interface ModuleRefData {
    name: string;
    desription: string;
    modules_ref: []
  }

export const fetchModuleRefs = async (req: any, res: any, next: any) => {
  const role = req.body.role;
  admin.firestore().collection("roles")
      .doc(role).get().then((docRef)=> {
        if (docRef.exists) {
          const data = docRef.data() as ModuleRefData;
          return res.status(200).json(data.modules_ref);
        } else {
          return res.status(200).json([]);
        }
      });
};


export const search = async (req: any, res: any, next: any) => {
  try {
    const name = req.body.name;
    const input = req.body.input;
    const result = await AlgoliaService.search(name, input);
    if (result) {
      return res.status(200).json(result);
    }
  } catch (err: any) {
    console.log(err);
    next(new Error(err));
  }
  return;
};

export const moduleNotifierCleaner = async (req: any, res: any, next: any) => {
  try {
    const role = req.body.role;
    const module_name = req.body.module_name;
    const uid = req.info.uid;


    admin.firestore().collection("module_notifiers")
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
          return res.status(200).json({message: "successfully"});
        });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({message: err});
    // next(new Error(err));
  }
};

export const subscribeTopicsToDevice =
async (req: any, res: any, next: any) => {
  try {
    const deviceToken = req.body.deviceToken;
    console.log(deviceToken, "deviceToken");
    const uid = req.info.uid;
    console.log(uid, "uid");

    // Update User Device Token
    await new FirestoreService().updateUserDeviceToken(uid, deviceToken);

    // Get Topics
    const topics = await new FirestoreService().getTopicsByUid(uid);

    // Unsubscribe Old Topic
    await new PushyService().unsubscribeOldTopics(deviceToken);

    // Subscribe New Topic
    await new PushyService().subscribe(deviceToken, topics);

    return res.status(200).json({message: "device subscribed to topic"});
  } catch (err: any) {
    console.log(err.message);
    return next(new Error(err));
  }
};
