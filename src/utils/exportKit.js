import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportLikedToJson(likedIds = []) {
  const payload = {
    type: 'cross-liked',
    version: 1,
    at: new Date().toISOString(),
    liked: likedIds,
  };
  const fileUri = FileSystem.documentDirectory + `liked_${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { dialogTitle: 'Export liked' });
  }
  return fileUri;
}
