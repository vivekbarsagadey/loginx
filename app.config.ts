import 'dotenv/config';

export default {
  "expo": {
    "scheme": "loginx",
    "extra": {
      "apiKey": process.env.API_KEY,
      "authDomain": process.env.AUTH_DOMAIN,
      "projectId": process.env.PROJECT_ID,
      "storageBucket": process.env.STORAGE_BUCKET,
      "messagingSenderId": process.env.MESSAGING_SENDER_ID,
      "appId": process.env.APP_ID
    },
    "android": {
      "package": "com.whizit.loginx",
      "minSdkVersion": 26
    }
  }
};
