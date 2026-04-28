import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PillButton } from '@/components/common/PillButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TaskCategoryFieldProps = {
  availableCategories: string[];
  category: string;
  onChangeCategory: (value: string) => void;
};

export const TaskCategoryField = ({
  availableCategories,
  category,
  onChangeCategory,
}: TaskCategoryFieldProps) => {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Category</Text>
      {availableCategories.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.categoryList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <PillButton
            label="None"
            onPress={() => onChangeCategory('')}
            selected={category.length === 0}
          />
          {availableCategories.map((categoryValue) => (
            <PillButton
              key={categoryValue}
              label={categoryValue}
              onPress={() => onChangeCategory(categoryValue)}
              selected={category === categoryValue}
            />
          ))}
        </ScrollView>
      ) : null}

      <TextInput
        onChangeText={onChangeCategory}
        placeholder="Optional category"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={category}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  categoryList: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  input: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.body,
  },
});
