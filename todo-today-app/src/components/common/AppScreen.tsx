import type { PropsWithChildren, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type AppScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  scroll?: boolean;
}>;

export function AppScreen({
  children,
  title,
  subtitle,
  headerRight,
  scroll = true,
}: AppScreenProps) {
  const content = (
    <View style={styles.inner}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {headerRight ? <View>{headerRight}</View> : null}
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {scroll ? <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
