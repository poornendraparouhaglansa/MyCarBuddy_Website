import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB1e_nM-v-G5EYZSrXjElyHo61I4qb5rNc",
  authDomain: "mycarbuddycustomer.firebaseapp.com",
  databaseURL: "https://mycarbuddycustomer-default-rtdb.firebaseio.com",
  projectId: "mycarbuddycustomer",
  storageBucket: "mycarbuddycustomer.firebasestorage.app",
  messagingSenderId: "98137449003",
  appId: "1:98137449003:web:f14e6f91c0126ef8f8806e",
  measurementId: "G-QG1DR5TCZN"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const getMessagingIfSupported = async () => {
  try {
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(firebaseApp);
  } catch (e) {
    return null;
  }
};

export const onForegroundMessage = (messagingInstance, handler) => {
  if (!messagingInstance) return () => {};
  return onMessage(messagingInstance, handler);
};
