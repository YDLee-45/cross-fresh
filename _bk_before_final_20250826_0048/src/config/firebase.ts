// src/config/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: '콘솔의 apiKey',
  authDomain: '콘솔의 authDomain',
  projectId: '콘솔의 projectId',
  storageBucket: '콘솔의 storageBucket',
  messagingSenderId: '콘솔의 messagingSenderId',
  appId: '콘솔의 appId',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
