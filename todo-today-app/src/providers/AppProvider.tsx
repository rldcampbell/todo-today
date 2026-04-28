import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
  SortDirection,
} from '@/features/backlog/backlog-types';

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
  archivedSortField: ArchivedBacklogSortField;
  archivedSortDirection: SortDirection;
  clearBacklogFilters: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [todayHideCompleted, setTodayHideCompleted] = useState(false);
  const [backlogSearch, setBacklogSearch] = useState('');
  const [backlogCategory, setBacklogCategory] = useState<string | null>(null);
  const [backlogStatus, setBacklogStatus] = useState<BacklogStatus>('current');
  const currentSortField: CurrentBacklogSortField = 'createdAt';
  const currentSortDirection: SortDirection = 'desc';
  const archivedSortField: ArchivedBacklogSortField = 'completedAt';
  const archivedSortDirection: SortDirection = 'desc';

  const clearBacklogFilters = useCallback(() => {
    setBacklogSearch('');
    setBacklogCategory(null);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      todayHideCompleted,
      setTodayHideCompleted,
      backlogSearch,
      setBacklogSearch,
      backlogCategory,
      setBacklogCategory,
      backlogStatus,
      setBacklogStatus,
      currentSortField,
      currentSortDirection,
      archivedSortField,
      archivedSortDirection,
      clearBacklogFilters,
    }),
    [
      todayHideCompleted,
      backlogSearch,
      backlogCategory,
      backlogStatus,
      currentSortField,
      currentSortDirection,
      archivedSortField,
      archivedSortDirection,
      clearBacklogFilters,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
