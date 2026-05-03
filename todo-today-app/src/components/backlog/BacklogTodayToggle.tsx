import { Pressable, StyleSheet, Text } from "react-native"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

type BacklogTodayToggleProps = {
  selected: boolean
  onPress?: () => void
}

export const BacklogTodayToggle = ({
  selected,
  onPress,
}: BacklogTodayToggleProps) => {
  return (
    <Pressable
      accessibilityLabel={
        selected ? "Remove task from Today" : "Add task to Today"
      }
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.buttonSelected,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.symbol, selected && styles.symbolSelected]}>
        {selected ? "✓" : "+"}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  buttonSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  symbol: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: typography.body,
    fontWeight: "700",
  },
  symbolSelected: {
    color: colors.accent,
  },
})
