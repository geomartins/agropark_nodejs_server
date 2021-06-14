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
      try {
        const a = new DepartmentsCreateChain(snap);

        const b = await (await a.updateSnapshot()).updateConfiguration();
        await (await b.updateActivities()).updateAngolia().then(() => {
          console.log("Department created successfully");
          return null;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    });

export const deleteDepartments = functions.firestore
    .document("departments/{docId}")
    .onDelete(async (snap, context) => {
      try {
        const deleteDepartmentChain = new DepartmentsDeleteChain(snap);
        await (await (await deleteDepartmentChain.updateConfiguration())
            .updateAngolia()).updateAngolia().then(() => {
          console.log("Department deleted successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
      return;
    });


export const updateDepartments = functions.firestore
    .document("departments/{docId}")
    .onUpdate(async (snap, context) => {
      try {
        const updateDepartmentChain = new DepartmentsUpdateChain(snap);
        const status = await (await updateDepartmentChain
            .verifyIfDocIsEdited()).objectStatus;

        if (status === false) {
          return;
        }

        const updateActivities = await (await (await
        updateDepartmentChain.updateSnapshot())
            .updateConfiguration()).updateActivities();

        await updateActivities.updateAngolia().then(() => {
          console.log("Department Updated Successfully");
          return;
        });
      } catch (err) {
        console.log(err);
        return null;
      }

      return;
    });
