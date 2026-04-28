import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/common/AppScreen';
import { FloatingAddButton } from '@/components/common/FloatingAddButton';
import { PillButton } from '@/components/common/PillButton';
import { ScaffoldNotice } from '@/components/common/ScaffoldNotice';
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

        <ScaffoldNotice
          body="This screen already matches the intended information architecture: persistent search, `Current / Archived`, and compact filter controls. The task rows and query logic are the next implementation layer."
          footer={`${tasks.length} tasks loaded`}
        />
      </AppScreen>

      <FloatingAddButton
        onPress={() => router.push({ pathname: '/task/new', params: { source: 'backlog' } })}
      />
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
});
