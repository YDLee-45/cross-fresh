import * as Linking from "expo-linking";
export const openDL = (path) => Linking.openURL(`cross://${path}`);
