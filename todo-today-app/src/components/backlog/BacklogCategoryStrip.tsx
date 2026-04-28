import { ScrollView, StyleSheet } from 'react-native';
import { PillButton } from '@/components/common/PillButton';
import { spacing } from '@/theme/spacing';

type BacklogCategoryStripProps = {
  availableCategories: string[];
  category: string | null;
  setCategory: (value: string | null) => void;
};

export const BacklogCategoryStrip = ({
  availableCategories,
  category,
  setCategory,
}: BacklogCategoryStripProps) => {
  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <PillButton
        label="All"
        onPress={() => setCategory(null)}
        selected={category === null}
      />
      {availableCategories.map((categoryValue) => (
        <PillButton
          key={categoryValue}
          label={categoryValue}
          onPress={() => setCategory(categoryValue)}
          selected={category === categoryValue}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
});
