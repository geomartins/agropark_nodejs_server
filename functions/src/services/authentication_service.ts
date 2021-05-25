import * as admin from "firebase-admin";
class AuthenticationService {
  constructor() {}

  async updatePassword(uid: string, newPassword: string) {
    return admin.auth().updateUser(uid, {
      password: newPassword,
    });
  }

  async updateUserStatus(uid: string, status: boolean) {
    return admin.auth().updateUser(uid, {
      disabled: status,
    });
  }

  async createUser(uid: string, email: string, displayName: string) {
    return admin
        .auth()
        .createUser({
          displayName: displayName,
          emailVerified: true,
          uid: uid,
          email: email,
          password: "agropark",
        });
  }

  async addCustomUserClaims(uid: string, role: string) {
    return admin.auth().setCustomUserClaims(uid, {
      moderator: role,
    });
  }

  async updateDisplayName(uid: string, fullname: string) {
    return admin.auth().updateUser(uid, {
      displayName: fullname,
    });
  }

  async updateCustomClaims(uid: string, role: string) {
    const user = await admin.auth().getUser(uid); // 1
    if (user.customClaims && user.customClaims.moderator == role) {
      return;
    }
    return admin.auth().setCustomUserClaims(user.uid, {
      moderator: role,
    }).then(() => {
      this.refreshToken(uid);
    });
  }

  async refreshToken(uid: string) {
    return admin.auth().revokeRefreshTokens(uid);
  }
}

export default AuthenticationService;
