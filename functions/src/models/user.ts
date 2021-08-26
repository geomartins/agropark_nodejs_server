import * as functions from "firebase-functions";
import UsersCreateChain from "../chains/users/users_create_chain";
import UsersUpdateChain from "../chains/users/users_update_chain";
import UsersDeleteChain from "../chains/users/users_delete_chain";

import UsersDocumentCreateChain from
  "../chains/users/users_document_create_chain";
import UsersDocumentDeleteChain from
  "../chains/users/users_document_delete_chain";
import UsersResetCreateChain from
  "../chains/users/users_reset_create_chain";


import UsersBankCreateChain from
  "../chains/users/users_bank_create_chain";
import UsersBankDeleteChain from
  "../chains/users/users_bank_delete_chain";
import UsersBankUpdateChain from
  "../chains/users/users_bank_update_chain";


import UsersDepartmentCreateChain from
  "../chains/users/users_department_create_chain";
import UsersDepartmentDeleteChain from
  "../chains/users/users_department_delete_chain";
import UsersDepartmentUpdateChain from
  "../chains/users/users_department_update_chain";

import UsersKinCreateChain from
  "../chains/users/users_kin_create_chain";
import UsersKinDeleteChain from
  "../chains/users/users_kin_delete_chain";
import UsersKinUpdateChain from
  "../chains/users/users_kin_update_chain";


// [Users] -> [] [@create, @update, @delete]
export const createUsers = functions.firestore
    .document("users/{userId}")
    .onCreate(async (snap, context) => {
      try {
        const a = new UsersCreateChain(snap);
        const b = await (await (await a.updateSnapshot())
            .createAuth()).createCustomClaim();

        await (await (await b.updateDependency()).notify())
            .updateAngolia().then(() => {
              console.log("createUserChain successfully executed");
              return null;
            });
      } catch (err) {
        console.log(err);
      }
      return null;
    });


export const deleteUsers = functions.firestore
    .document("users/{userId}")
    .onDelete(async (snap, context) => {
      try {
        const a = new UsersDeleteChain(snap);
        await (await (await a.updateDependency()).notify())
            .updateAngolia().then(() => {
              console.log("deleteUserChain successfully executed");
              return null;
            });
      } catch (err) {
        console.log(err);
      }
      return null;
    });


export const updateUsers = functions.firestore
    .document("users/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateUserChain = new UsersUpdateChain(snap);
        const status = await (await updateUserChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }


        const updateDisplayName = await (await (await updateUserChain
            .updateSnapshot()).updateCustomClaims()).updateDisplayName();

        await (await (await updateDisplayName.updateAvatar())
            .notify()).updateAngolia();


        return null;
      } catch (err) {
        console.log(err);
      }

      return null;
    });

// [Users] -> [Document] [@create, @delete]
export const createUsersDocument = functions.firestore
    .document("users/{userId}/documents/{documentId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await
        new UsersDocumentCreateChain(snap, context.params.userId)
            .updateSnapshot();

        await a.notify().then(() => {
          console.log("Document added Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


export const deleteUsersDocument = functions.firestore
    .document("users/{userId}/documents/{documentId}")
    .onDelete(async (snap, context) => {
      try {
        const a = await
        new UsersDocumentDeleteChain(snap, context.params.userId);

        await a.notify().then(() => {
          console.log("Document added Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


// [Users] -> [Reset] [@create]
export const createUsersReset = functions.firestore
    .document("users/{userId}/resets/{resetId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await
        new UsersResetCreateChain(snap, context.params.userId).updateSnapshot();

        await (await a.updatePassword())
            .notify().then(() => {
              console.log("Password Update Successful");
            });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


// [Users] -> [Bank] [@create, @update, @delete]
export const createUsersBank = functions.firestore
    .document("users/{userId}/banks/{bankId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await
        new UsersBankCreateChain(snap, context.params.userId)
            .updateSnapshot();

        await a.notify().then(() => {
          console.log("Bank added Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });

export const updateUsersBank = functions.firestore
    .document("users/{userId}/banks/{bankId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateUserBankChain =
         new UsersBankUpdateChain(snap, context.params.userId);
        const status = await (await updateUserBankChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        await (await updateUserBankChain.updateSnapshot()).notify().then(() => {
          console.log("User Bank Update Successful");
        });


        return null;
      } catch (err) {
        console.log(err);
      }

      return null;
    });

export const deleteUsersBank = functions.firestore
    .document("users/{userId}/banks/{bankId}")
    .onDelete(async (snap, context) => {
      try {
        const a = await
        new UsersBankDeleteChain(snap, context.params.userId);

        await a.notify().then(() => {
          console.log("Users Bank deleted Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


// [Users] -> [Kin] [@create, @update, @delete]
export const createUsersKin = functions.firestore
    .document("users/{userId}/kins/{kinId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await
        new UsersKinCreateChain(snap, context.params.userId)
            .updateSnapshot();

        await a.notify().then(() => {
          console.log("Users Kin added Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });

export const updateUsersKin = functions.firestore
    .document("users/{userId}/kins/{kinId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateUserKinChain =
         new UsersKinUpdateChain(snap, context.params.userId);
        const status = await (await updateUserKinChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        await (await updateUserKinChain.updateSnapshot()).notify().then(() => {
          console.log("User Kin Update Successful");
        });


        return null;
      } catch (err) {
        console.log(err);
      }

      return null;
    });

export const deleteUsersKin = functions.firestore
    .document("users/{userId}/kins/{kinId}")
    .onDelete(async (snap, context) => {
      try {
        const a = await
        new UsersKinDeleteChain(snap, context.params.userId);

        await a.notify().then(() => {
          console.log("Users Kin deleted Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


// [Users] -> [Department] [@create, @update, @delete]
export const createUsersDepartment = functions.firestore
    .document("users/{userId}/departments/{departmentId}")
    .onCreate(async (snap, context) => {
      try {
        const a = await
        new UsersDepartmentCreateChain(snap, context.params.userId)
            .updateSnapshot();

        await a.notify().then(() => {
          console.log("User Department added Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


export const deleteUsersDepartment = functions.firestore
    .document("users/{userId}/departments/{departmentId}")
    .onDelete(async (snap, context) => {
      try {
        const a = await
        new UsersDepartmentDeleteChain(snap, context.params.userId);

        await a.notify().then(() => {
          console.log("Users Department deleted Successful");
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return null;
    });


export const updateUsersDepartment = functions.firestore
    .document("users/{userId}/departments/{departmentId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateUserDepartmentChain =
         new UsersDepartmentUpdateChain(snap, context.params.userId);
        const status = await (await updateUserDepartmentChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        await (await updateUserDepartmentChain.updateSnapshot())
            .notify().then(() => {
              console.log("User Department Update Successful");
            });


        return null;
      } catch (err) {
        console.log(err);
      }

      return null;
    });


