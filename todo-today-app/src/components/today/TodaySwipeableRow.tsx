import type { PropsWithChildren } from "react"
import type { TextStyle, ViewStyle } from "react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import { copy } from "@/copy"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

type TodaySwipeableRowProps = PropsWithChildren<{
  enabled?: boolean
  onRemove?: () => void
}>

export const TodaySwipeableRow = ({
  children,
  enabled = true,
  onRemove,
}: TodaySwipeableRowProps) => {
  if (!enabled || !onRemove) {
    return children
  }

  const renderRightActions = (
    _progress: unknown,
    _translation: unknown,
    swipeableMethods: SwipeableMethods,
  ) => {
    const handleRemove = () => {
      swipeableMethods.close()
      onRemove()
    }

    return (
      <View style={styles.actionsContainer}>
        <Pressable
          accessibilityLabel={copy(
            "today.swipeActions.removeAccessibilityLabel",
          )}
          onPress={handleRemove}
          style={styles.removeAction}
        >
          <Text style={styles.removeActionText}>
            {copy("today.swipeActions.remove")}
          </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeableContainer}
      friction={2}
      overshootRight={false}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      {children}
    </ReanimatedSwipeable>
  )
}

const styles = StyleSheet.create<{
  swipeableContainer: ViewStyle
  actionsContainer: ViewStyle
  removeAction: ViewStyle
  removeActionText: TextStyle
}>({
  swipeableContainer: {
    borderRadius: 18,
    overflow: "hidden",
  },
  actionsContainer: {
    width: 94,
    paddingLeft: spacing.sm,
    marginVertical: 1,
  },
  removeAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.dangerMuted,
    paddingHorizontal: spacing.lg,
  },
  removeActionText: {
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: "700",
  },
})
