import {
  useEffect,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { loadAppStateEntries, upsertAppStateValue } from '@/db/app-state';
import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
  SortDirection,
} from '@/features/backlog/backlog-types';
import {
  type AppStateKey,
  type AppPreferences,
  appStateKeys,
} from '@/features/app-state/app-preferences-types';
import { defaultAppPreferences } from '@/features/app-state/defaultAppPreferences';
import { hydrateAppPreferences } from '@/features/app-state/hydrateAppPreferences';

type AppContextValue = {
  todayHideCompleted: boolean;
  setTodayHideCompleted: (value: boolean) => void;
  backlogSearch: string;
  setBacklogSearch: (value: string) => void;
  backlogCategory: string | null;
  setBacklogCategory: (value: string | null) => void;
  backlogStatus: BacklogStatus;
  setBacklogStatus: (value: BacklogStatus) => void;
  currentSortField: CurrentBacklogSortField;
  currentSortDirection: SortDirection;
  setCurrentSortField: (value: CurrentBacklogSortField) => void;
  setCurrentSortDirection: (value: SortDirection) => void;
  archivedSortField: ArchivedBacklogSortField;
  archivedSortDirection: SortDirection;
  setArchivedSortField: (value: ArchivedBacklogSortField) => void;
  setArchivedSortDirection: (value: SortDirection) => void;
  clearBacklogFilters: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const db = useSQLiteContext();
  const [preferences, setPreferences] = useState<AppPreferences>(
    defaultAppPreferences,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydratePreferences = async () => {
      try {
        const entries = await loadAppStateEntries(db);

        if (!isMounted) {
          return;
        }

        setPreferences(hydrateAppPreferences(entries));
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    void hydratePreferences();

    return () => {
      isMounted = false;
    };
  }, [db]);

  const updatePreference = useCallback(
    <TKey extends keyof AppPreferences>(
      key: TKey,
      value: AppPreferences[TKey],
    ) => {
      setPreferences((currentPreferences) => ({
        ...currentPreferences,
        [key]: value,
      }));
    },
    [],
  );

  const persistPreference = useCallback(
    async (key: AppStateKey, value: string) => {
      await upsertAppStateValue(db, key, value);
    },
    [db],
  );

  const setTodayHideCompleted = useCallback(
    (value: boolean) => {
      updatePreference('todayHideCompleted', value);
      void persistPreference(appStateKeys.todayHideCompleted, String(value));
    },
    [persistPreference, updatePreference],
  );

  const setBacklogSearch = useCallback(
    (value: string) => {
      updatePreference('backlogSearch', value);
      void persistPreference(appStateKeys.backlogSearch, value);
    },
    [persistPreference, updatePreference],
  );

  const setBacklogCategory = useCallback(
    (value: string | null) => {
      updatePreference('backlogCategory', value);
      void persistPreference(appStateKeys.backlogCategory, value ?? '');
    },
    [persistPreference, updatePreference],
  );

  const setBacklogStatus = useCallback(
    (value: BacklogStatus) => {
      updatePreference('backlogStatus', value);
      void persistPreference(appStateKeys.backlogStatus, value);
    },
    [persistPreference, updatePreference],
  );

  const setCurrentSortField = useCallback(
    (value: CurrentBacklogSortField) => {
      updatePreference('currentSortField', value);
      void persistPreference(appStateKeys.currentSortField, value);
    },
    [persistPreference, updatePreference],
  );

  const setCurrentSortDirection = useCallback(
    (value: SortDirection) => {
      updatePreference('currentSortDirection', value);
      void persistPreference(appStateKeys.currentSortDirection, value);
    },
    [persistPreference, updatePreference],
  );

  const setArchivedSortField = useCallback(
    (value: ArchivedBacklogSortField) => {
      updatePreference('archivedSortField', value);
      void persistPreference(appStateKeys.archivedSortField, value);
    },
    [persistPreference, updatePreference],
  );

  const setArchivedSortDirection = useCallback(
    (value: SortDirection) => {
      updatePreference('archivedSortDirection', value);
      void persistPreference(appStateKeys.archivedSortDirection, value);
    },
    [persistPreference, updatePreference],
  );

  const clearBacklogFilters = useCallback(() => {
    updatePreference('backlogSearch', '');
    updatePreference('backlogCategory', null);
    void Promise.all([
      persistPreference(appStateKeys.backlogSearch, ''),
      persistPreference(appStateKeys.backlogCategory, ''),
    ]);
  }, [persistPreference, updatePreference]);

  const value = useMemo<AppContextValue>(
    () => ({
      todayHideCompleted: preferences.todayHideCompleted,
      setTodayHideCompleted,
      backlogSearch: preferences.backlogSearch,
      setBacklogSearch,
      backlogCategory: preferences.backlogCategory,
      setBacklogCategory,
      backlogStatus: preferences.backlogStatus,
      setBacklogStatus,
      currentSortField: preferences.currentSortField,
      currentSortDirection: preferences.currentSortDirection,
      setCurrentSortField,
      setCurrentSortDirection,
      archivedSortField: preferences.archivedSortField,
      archivedSortDirection: preferences.archivedSortDirection,
      setArchivedSortField,
      setArchivedSortDirection,
      clearBacklogFilters,
    }),
    [
      preferences,
      clearBacklogFilters,
      setArchivedSortDirection,
      setArchivedSortField,
      setBacklogCategory,
      setBacklogSearch,
      setBacklogStatus,
      setCurrentSortDirection,
      setCurrentSortField,
      setTodayHideCompleted,
    ],
  );

  if (!isHydrated) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
