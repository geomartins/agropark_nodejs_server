import * as functions from "firebase-functions";

import DepartmentsCreateChain from
  "../chains/departments/departments_create_chain";
import DepartmentsDeleteChain from
  "../chains/departments/departments_delete_chain";
import DepartmentsUpdateChain from
  "../chains/departments/departments_update_chain";

export const createDepartments = functions.firestore
    .document("departments/{docId}")
    .onCreate(async (snap, context) => {
      const a = (await new DepartmentsCreateChain(snap)
          .fetchCreatorDetails());
      const b = await (await a.updateSnapshot()).updateConfiguration();
      await (await b.updateModuleActivities()).updateAngolia().then(() => {
        console.log("createDepartmentChain successfully executed");
        return null;
      }).catch((err) => {
        console.log(err);
      });
      return null;
    });

export const deleteDepartments = functions.firestore
    .document("departments/{docId}")
    .onDelete(async (snap, context) => {
      const deleteDepartmentChain = new DepartmentsDeleteChain(snap);
      await (await (await deleteDepartmentChain
          .updateConfiguration())
          .updateModuleActivities())
          .updateAngolia().then(() => {
            console.log("deleteDepartmentChain succesfully executed");
          }).catch((err) => {
            console.log(err);
          });
      return null;
    });


export const updateDepartments = functions.firestore
    .document("departments/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateDepartmentChain = new DepartmentsUpdateChain(snap);
        const userType = await (await updateDepartmentChain
            .verifyUserTypeAndEvent())
            .userType;

        if (userType == "") {
          return;
        }

        if (userType == "deleter") {
          await updateDepartmentChain.deleteSnapshot();
          return;
        }

        if (userType == "editor") {
          const updatedSnapshot = await (await (await updateDepartmentChain
              .verifyUserTypeAndEvent())
              .fetchUserDetails()).updateSnapshot();

          const status = await (await updatedSnapshot.checkObjectStatus())
              .objectStatus;

          if (status == false) {
            return;
          }
          if (status == true) {
            (await (await (await updatedSnapshot.checkObjectStatus())
                .updateConfiguration()).updateModuleActivities())
                .updateAngolia();
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }


      return null;
    });
