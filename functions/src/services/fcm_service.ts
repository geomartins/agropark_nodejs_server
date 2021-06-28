import * as admin from "firebase-admin";

class FcmService {
  public async pushToTopic(topic: string, payload: any) {
    return await admin.messaging().sendToTopic(topic, payload);
  }

  public async pushToDevice(token: string | string[], payload: any) {
    return await admin.messaging().sendToDevice(token, payload);
  }


  public async subscribe(deviceToken: string | string[], topic: string) {
    return await admin.messaging().subscribeToTopic(deviceToken, topic);
  }

  public async unsubscribe(deviceToken: string | string[], topic: string) {
    return await admin.messaging().unsubscribeFromTopic(deviceToken, topic);
  }


  async subscribeAll(deviceToken: string, topics: string[]) {
    for (const topic of topics) {
      admin.messaging().subscribeToTopic(deviceToken, topic);
    }
    return;
  }

  public async unsubscribeAll(deviceToken: string, topics: string[]) {
    // for (const topic of topics) {
    //   admin.messaging().unsubscribeFromTopic(deviceToken, topic);
    // }
    return;
  }
}

export default FcmService;
