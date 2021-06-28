import * as express from "express";
import * as authMiddleware from "../middewares/auth";
import * as utilityController from "../controllers/utility_controller";

const router = express.Router();

router.post("/modules", [authMiddleware.auth,
  utilityController.fetchModuleRefs]);

router.post("/search", [authMiddleware.auth, utilityController.search]);

router.post("/subscribe", [authMiddleware.auth,
  utilityController.subscribeTopicsToDevice]);

router.get("/test", (req, res, next) => {
  res.render("notification");
});


router.post("/module_notifier_cleaner",
    [authMiddleware.auth, utilityController.moduleNotifierCleaner]);


export default router;

