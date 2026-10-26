import {NativeModules} from 'react-native';
import {get, set} from './asyncStorageFunction';

const WIDGET_BIRTH_DATE_KEY = 'widget_birth_date';

type SharedWidgetModule = {
  setData: (
    key: string,
    data: string,
    callback: (didSync: boolean) => void,
  ) => void;
};

/**
 * Writes only a created or changed birthday to native widget storage. Each
 * native widget derives its clock and refresh schedule independently afterward.
 */
export function syncLifeWidget(birthDate: string): Promise<boolean> {
  const widgetModule = NativeModules.RNSharedWidget as
    | SharedWidgetModule
    | undefined;

  if (!widgetModule?.setData) {
    return Promise.resolve(false);
  }

  return new Promise(resolve => {
    widgetModule.setData(
      'lifeCounter',
      JSON.stringify({birthDate}),
      didSync => resolve(Boolean(didSync)),
    );
  });
}

/**
 * Seeds native widget storage once for an existing app install. This repairs
 * widgets created before the birthday-only data contract existed, without
 * bringing back the old recurring age sync.
 */
export async function ensureLifeWidgetBirthDate(
  birthDate: string,
): Promise<boolean> {
  const lastSyncedBirthDate = await get(WIDGET_BIRTH_DATE_KEY);
  if (lastSyncedBirthDate === birthDate) {
    return true;
  }

  const didSync = await syncLifeWidget(birthDate);
  if (!didSync) {
    return false;
  }

  return set(WIDGET_BIRTH_DATE_KEY, birthDate);
}
