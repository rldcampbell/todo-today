import { Fragment } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { PillButton } from "@/components/common/PillButton"
import { spacing } from "@/theme/spacing"

type BacklogCategoryStripProps = {
  availableCategories: string[]
  category: string | null
  setCategory: (value: string | null) => void
  onDeleteCategory?: (value: string) => void
  deleteDisabled?: boolean
}

export const BacklogCategoryStrip = ({
  availableCategories,
  category,
  setCategory,
  onDeleteCategory,
  deleteDisabled = false,
}: BacklogCategoryStripProps) => {
  if (availableCategories.length === 0) {
    return null
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
        <Fragment key={categoryValue}>
          <PillButton
            label={categoryValue}
            onPress={() => setCategory(categoryValue)}
            selected={category === categoryValue}
          />
          {category === categoryValue && onDeleteCategory ? (
            <PillButton
              destructive
              disabled={deleteDisabled}
              label="Delete"
              onPress={() => onDeleteCategory(categoryValue)}
            />
          ) : null}
        </Fragment>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
})
