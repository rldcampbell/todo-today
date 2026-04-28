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
import { defaultBacklogViewState } from '@/features/backlog/defaultBacklogViewState';
import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
  SortDirection,
} from '@/features/backlog/backlog-types';
import type { BacklogViewState } from '@/features/backlog/backlog-view-state-types';
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
  const [backlogViewState, setBacklogViewState] = useState<BacklogViewState>(
    defaultBacklogViewState,
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

  const updateBacklogViewState = useCallback(
    <TKey extends keyof BacklogViewState>(
      key: TKey,
      value: BacklogViewState[TKey],
    ) => {
      setBacklogViewState((currentState) => ({
        ...currentState,
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
      updateBacklogViewState('search', value);
    },
    [updateBacklogViewState],
  );

  const setBacklogCategory = useCallback(
    (value: string | null) => {
      updateBacklogViewState('category', value);
    },
    [updateBacklogViewState],
  );

  const setBacklogStatus = useCallback(
    (value: BacklogStatus) => {
      updateBacklogViewState('status', value);
    },
    [updateBacklogViewState],
  );

  const setCurrentSortField = useCallback(
    (value: CurrentBacklogSortField) => {
      updateBacklogViewState('currentSortField', value);
    },
    [updateBacklogViewState],
  );

  const setCurrentSortDirection = useCallback(
    (value: SortDirection) => {
      updateBacklogViewState('currentSortDirection', value);
    },
    [updateBacklogViewState],
  );

  const setArchivedSortField = useCallback(
    (value: ArchivedBacklogSortField) => {
      updateBacklogViewState('archivedSortField', value);
    },
    [updateBacklogViewState],
  );

  const setArchivedSortDirection = useCallback(
    (value: SortDirection) => {
      updateBacklogViewState('archivedSortDirection', value);
    },
    [updateBacklogViewState],
  );

  const clearBacklogFilters = useCallback(() => {
    updateBacklogViewState('search', '');
    updateBacklogViewState('category', null);
  }, [updateBacklogViewState]);

  const value = useMemo<AppContextValue>(
    () => ({
      todayHideCompleted: preferences.todayHideCompleted,
      setTodayHideCompleted,
      backlogSearch: backlogViewState.search,
      setBacklogSearch,
      backlogCategory: backlogViewState.category,
      setBacklogCategory,
      backlogStatus: backlogViewState.status,
      setBacklogStatus,
      currentSortField: backlogViewState.currentSortField,
      currentSortDirection: backlogViewState.currentSortDirection,
      setCurrentSortField,
      setCurrentSortDirection,
      archivedSortField: backlogViewState.archivedSortField,
      archivedSortDirection: backlogViewState.archivedSortDirection,
      setArchivedSortField,
      setArchivedSortDirection,
      clearBacklogFilters,
    }),
    [
      preferences,
      backlogViewState,
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
