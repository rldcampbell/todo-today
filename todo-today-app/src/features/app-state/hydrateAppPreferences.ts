import {
  appStateKeys,
  type AppPreferences,
} from '@/features/app-state/app-preferences-types';
import { defaultAppPreferences } from '@/features/app-state/defaultAppPreferences';

const parseBooleanValue = (
  rawValue: string | undefined,
  fallbackValue: boolean,
) => {
  if (!rawValue) {
    return fallbackValue;
  }

  if (rawValue === 'true') {
    return true;
  }

  if (rawValue === 'false') {
    return false;
  }

  return fallbackValue;
};

export const hydrateAppPreferences = (
  entries: Record<string, string>,
): AppPreferences => {
  return {
    todayHideCompleted: parseBooleanValue(
      entries[appStateKeys.todayHideCompleted],
      defaultAppPreferences.todayHideCompleted,
    ),
  };
};
