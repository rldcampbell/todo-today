import { StyleSheet, TextInput } from "react-native"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

type BacklogSearchInputProps = {
  value: string
  onChangeText: (value: string) => void
}

export const BacklogSearchInput = ({
  value,
  onChangeText,
}: BacklogSearchInputProps) => {
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
      onChangeText={onChangeText}
      placeholder="Search title or description"
      placeholderTextColor={colors.textMuted}
      returnKeyType="search"
      style={styles.search}
      value={value}
    />
  )
}

const styles = StyleSheet.create({
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
})
