import {
  archivedBacklogSortFields,
  backlogStatuses,
  currentBacklogSortFields,
  sortDirections,
} from '@/features/backlog/backlog-types';
import {
  appStateKeys,
  type AppPreferences,
} from '@/features/app-state/app-preferences-types';
import { defaultAppPreferences } from '@/features/app-state/defaultAppPreferences';

const parseEnumValue = <TValue extends string>(
  rawValue: string | undefined,
  allowedValues: readonly TValue[],
  fallbackValue: TValue,
) => {
  if (!rawValue) {
    return fallbackValue;
  }

  return allowedValues.includes(rawValue as TValue)
    ? (rawValue as TValue)
    : fallbackValue;
};

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

const parseNullableTextValue = (
  rawValue: string | undefined,
  fallbackValue: string | null,
) => {
  if (rawValue === undefined) {
    return fallbackValue;
  }

  return rawValue.length > 0 ? rawValue : null;
};

export const hydrateAppPreferences = (
  entries: Record<string, string>,
): AppPreferences => {
  return {
    todayHideCompleted: parseBooleanValue(
      entries[appStateKeys.todayHideCompleted],
      defaultAppPreferences.todayHideCompleted,
    ),
    backlogSearch:
      entries[appStateKeys.backlogSearch] ??
      defaultAppPreferences.backlogSearch,
    backlogCategory: parseNullableTextValue(
      entries[appStateKeys.backlogCategory],
      defaultAppPreferences.backlogCategory,
    ),
    backlogStatus: parseEnumValue(
      entries[appStateKeys.backlogStatus],
      backlogStatuses,
      defaultAppPreferences.backlogStatus,
    ),
    currentSortField: parseEnumValue(
      entries[appStateKeys.currentSortField],
      currentBacklogSortFields,
      defaultAppPreferences.currentSortField,
    ),
    currentSortDirection: parseEnumValue(
      entries[appStateKeys.currentSortDirection],
      sortDirections,
      defaultAppPreferences.currentSortDirection,
    ),
    archivedSortField: parseEnumValue(
      entries[appStateKeys.archivedSortField],
      archivedBacklogSortFields,
      defaultAppPreferences.archivedSortField,
    ),
    archivedSortDirection: parseEnumValue(
      entries[appStateKeys.archivedSortDirection],
      sortDirections,
      defaultAppPreferences.archivedSortDirection,
    ),
  };
};
