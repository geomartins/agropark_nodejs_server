import * as express from "express";
import * as authMiddleware from "../middewares/auth";
import * as utilityController from "../controllers/utility_controller";
import {body} from "express-validator";


const router = express.Router();

router.post("/modules",
    body("role").not().isEmpty().withMessage("[ role ] must not be empty"),
    [authMiddleware.auth,
      utilityController.fetchModuleRefs]);


router.get("/test", (req: any, res: any, next: any) => {
  res.render("test");
});

router.post("/search",
    body("name").not().isEmpty().withMessage("[ name ] must not be empty"),
    body("input").not().isEmpty().withMessage("[ input ] must not be empty"),
    [authMiddleware.auth, utilityController.search]);

router.post("/subscribe",
    body("deviceToken").not().isEmpty()
        .withMessage("[ deviceToken ] must not be empty"),
    [authMiddleware.auth, utilityController.subscribeTopicsToDevice]);


router.post("/module_notifier_cleaner",
    body("module_name").not().isEmpty()
        .withMessage("[ moduleName ] must not be empty"),
    [authMiddleware.auth, utilityController.moduleNotifierCleaner]);


export default router;

