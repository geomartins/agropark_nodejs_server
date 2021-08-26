
import * as admin from "firebase-admin";
import {validationResult} from "express-validator";
export const auth = async (req: any, res: any, next: any ) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0]["msg"]);
    }

    const authorization = req.get("Authorization");
    if (!authorization) {
      throw new Error("No credentials sent!");
    }

    const tokenId = authorization.split("Bearer ")[1];
    if (!tokenId) {
      throw new Error("No token sent!");
    }

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    if (!decodedToken) {
      throw new Error("nvalid token sent!");
    }
    const info = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    req.info = info;
    return next();
  } catch (err: any) {
    return next(err);
  }
};
