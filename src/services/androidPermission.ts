import {Alert, PermissionsAndroid, Platform} from 'react-native';

export async function hasAndroidPermission() {
  try {
    if (Number(Platform.Version) >= 33) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ];
      const statuses = await PermissionsAndroid.requestMultiple(permissions);
      const granted = permissions.every(
        permission =>
          statuses[permission] === PermissionsAndroid.RESULTS.GRANTED,
      );
      if (granted) return true;
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    }

    Alert.alert(
      "We can't save the screenshot.",
      'Please allow photo access in Settings and try again.',
    );
  } catch {
    Alert.alert('Could not request photo access', 'Please try again.');
  }

  return false;
}
