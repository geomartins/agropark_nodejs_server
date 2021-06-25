import * as admin from "firebase-admin";
export const auth = async (req: any, res: any, next: any ) => {
  const tokenId = req.get("Authorization").split("Bearer ")[1];

  return admin.auth().verifyIdToken(tokenId).then((decodedToken) => {
    const info = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    req.info = info;
    return next();
  }).catch((err) => {
    const error = new Error(err);
    return next(error);
  });
};
