import type { PropsWithChildren } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { StyleSheet, View } from "react-native"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"

type SurfaceCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
}>

export const SurfaceCard = ({ children, style }: SurfaceCardProps) => {
  return <View style={[styles.card, style]}>{children}</View>
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
})
