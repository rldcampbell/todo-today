import type { ReactNode } from "react"
import { Pressable, StyleSheet, Text } from "react-native"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"
type PillButtonProps = {
  label: string
  onPress?: () => void
  selected?: boolean
  destructive?: boolean
  icon?: ReactNode
  disabled?: boolean
}
export const PillButton = ({
  label,
  onPress,
  selected = false,
  destructive = false,
  icon,
  disabled = false,
}: PillButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.buttonSelected,
        destructive && styles.buttonDestructive,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          destructive && styles.labelDestructive,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  button: {
    minHeight: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  buttonSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  buttonDestructive: {
    backgroundColor: colors.dangerMuted,
    borderColor: colors.dangerMuted,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "600",
  },
  labelSelected: {
    color: colors.accent,
  },
  labelDestructive: {
    color: colors.danger,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
})
