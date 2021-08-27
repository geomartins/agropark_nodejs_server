
import * as functions from "firebase-functions";
import axios from "axios";
const SECRET_API_KEY =
functions.config().pushy.key;

/**
 * @namespace
 */
class PushyService {
  constructor() {}

  async subscribe(token: string, topics: string[] ) {
    if (topics.length < 1) {
      return;
    }
    return await axios.post("https://api.pushy.me/topics/subscribe?api_key="+SECRET_API_KEY, {
      token: token,
      topics: topics,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log(err);
    });
  }

  async unsubscribe(token: string, topics: string[]) {
    return await axios.post("https://api.pushy.me/topics/unsubscribe?api_key="+SECRET_API_KEY, {
      token: token,
      topics: topics,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log(err);
    });
  }

  async topics() {
    return await axios.get("https://api.pushy.me/topics?api_key="+SECRET_API_KEY).catch((err) => {
      console.log(err);
    });
  }

  async subscribers(topic: string) {
    return await axios.get("https://api.pushy.me/topics/"+topic+"?api_key="+SECRET_API_KEY).catch((err) => {
      console.log(err);
    });
  }

  async unsubscribeOldTopics(device_token: string) {
    // try {
    //   const data = await (await this.deviceInfo(device_token))?.data;
    //   if (data) {
    //     await this.unsubscribe(device_token, data.subscriptions);
    //   }
    //   return;
    // } catch (err) {
    //   console.log(err);
    // }
    return;
  }

  async deviceInfo(device_token: string) {
    return await axios.get("https://api.pushy.me/devices/"+device_token+"?api_key="+SECRET_API_KEY).catch((err) => {
      console.log(err);
    });
  }

  async devicePresence() {
    return await axios.post("https://api.pushy.me/devices/presence?api_key="+SECRET_API_KEY, {}, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log(err);
    });
  }

  async pushToDevices(devices: string | string[],
      data: {title: string; message: string}, notification: any) {
    if (devices.length < 1) {
      return;
    }
    return await axios.post(" https://api.pushy.me/push?api_key="+SECRET_API_KEY, {
      to: devices,
      data: data,
      notification: notification,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log(err);
    });
  }

  async pushToTopics(topics: string | string[],
      data: {title: string; message: string}, notification: any) {
    return await axios.post(" https://api.pushy.me/push?api_key="+SECRET_API_KEY, {
      to: topics,
      data: data,
      notification: notification,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log(err);
    });
  }
}

export default PushyService;
