// src/services/auth.ts  (임시 스텁)
export async function emailSignIn(_email?: string, _pass?: string) {
  return { uid: 'dev' };
}
export async function emailSignUp(_email?: string, _pass?: string) {
  return { uid: 'dev' };
}
export async function resetPassword(_email?: string) {
  return true;
}
