import { SQLiteProvider } from 'expo-sqlite';
import type { ReactNode } from 'react';

import { DATABASE_NAME } from '@/db/client';
import { migrateDbIfNeeded } from '@/db/migrations';

type DatabaseProviderProps = {
  children: ReactNode;
};

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
      {children}
    </SQLiteProvider>
  );
}
