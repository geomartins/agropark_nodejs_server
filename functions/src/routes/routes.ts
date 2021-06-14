import * as express from "express";
import * as admin from "firebase-admin";
import AlgoliaService from "../services/algolia_service";
const router = express.Router();

interface ModuleRefData {
  name: string;
  desription: string;
  modules_ref: []
}
router.post("/modules", async (req, res, next) => {
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
});

router.post("/search", async (req, res, next) => {
  console.log("Innnnnnnnns");
  try {
    const name = req.body.name;
    const input = req.body.input;
    const result = await AlgoliaService.search(name, input);
    if (result) {
      return res.status(200).json(result);
    }
  } catch (err) {
    console.log(err);
  }
  return;
});


export default router;

