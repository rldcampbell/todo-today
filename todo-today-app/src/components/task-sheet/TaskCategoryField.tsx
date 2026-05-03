import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { PillButton } from "@/components/common/PillButton"
import { copy } from "@/copy"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

type TaskCategoryFieldProps = {
  availableCategories: string[]
  category: string
  onChangeCategory: (value: string) => void
}

export const TaskCategoryField = ({
  availableCategories,
  category,
  onChangeCategory,
}: TaskCategoryFieldProps) => {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {copy("taskSheet.fields.category.label")}
      </Text>
      {availableCategories.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.categoryList}
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
        >
          <PillButton
            label={copy("taskSheet.fields.category.none")}
            onPress={() => onChangeCategory("")}
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
        placeholder={copy("taskSheet.fields.category.placeholder")}
        placeholderTextColor={colors.textMuted}
        returnKeyType="done"
        style={styles.input}
        value={category}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
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
})
