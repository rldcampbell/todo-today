import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/common/AppScreen';
import { FloatingAddButton } from '@/components/common/FloatingAddButton';
import { PillButton } from '@/components/common/PillButton';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { useBacklog } from '@/hooks/useBacklog';
import { useToday } from '@/hooks/useToday';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function BacklogScreen() {
  const router = useRouter();
  const { incompleteCount } = useToday();
  const {
    search,
    setSearch,
    status,
    setStatus,
    sortField,
    sortDirection,
    category,
    clearFilters,
    tasks,
  } = useBacklog();

  return (
    <View style={styles.container}>
      <AppScreen title="Backlog" subtitle={`Today ${incompleteCount}`}>
        <TextInput
          onChangeText={setSearch}
          placeholder="Search title or description"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
          value={search}
        />

        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setStatus('current')}
            style={[styles.segmentButton, status === 'current' && styles.segmentButtonSelected]}
          >
            <Text style={[styles.segmentLabel, status === 'current' && styles.segmentLabelSelected]}>
              Current
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setStatus('archived')}
            style={[styles.segmentButton, status === 'archived' && styles.segmentButtonSelected]}
          >
            <Text style={[styles.segmentLabel, status === 'archived' && styles.segmentLabelSelected]}>
              Archived
            </Text>
          </Pressable>
        </View>

        <View style={styles.filterBar}>
          <PillButton label={`Sort: ${sortField} ${sortDirection}`} />
          <PillButton label={category ? `Category: ${category}` : 'Category'} />
          <PillButton label="Clear" onPress={clearFilters} />
        </View>

        <SurfaceCard>
          <Text style={styles.sectionLabel}>Scaffold state</Text>
          <Text style={styles.sectionBody}>
            This screen already matches the intended information architecture: persistent search,
            `Current / Archived`, and compact filter controls. The task rows and query logic are the
            next implementation layer.
          </Text>
          <Text style={styles.sectionMeta}>{tasks.length} tasks loaded</Text>
        </SurfaceCard>
      </AppScreen>

      <FloatingAddButton onPress={() => router.push('/task/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  search: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontSize: typography.body,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.xs,
  },
  segmentButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: colors.surface,
  },
  segmentLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  segmentLabelSelected: {
    color: colors.text,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.accent,
    fontSize: typography.meta,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  sectionMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
