import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
} from 'firebase/auth';

export async function emailSignIn(email: string, pw: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email.trim(), pw);
}

export async function emailSignUp(email: string, pw: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email.trim(), pw);
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email.trim());
}

export async function logout(): Promise<void> {
  return signOut(auth);
}
