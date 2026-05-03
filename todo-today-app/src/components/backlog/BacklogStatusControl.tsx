import { Pressable, StyleSheet, Text, View } from "react-native"
import { copy } from "@/copy"
import type { BacklogStatus } from "@/features/backlog/backlog-types"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

type BacklogStatusControlProps = {
  status: BacklogStatus
  onChange: (value: BacklogStatus) => void
}

export const BacklogStatusControl = ({
  status,
  onChange,
}: BacklogStatusControlProps) => {
  return (
    <View style={styles.segmentedControl}>
      <Pressable
        onPress={() => onChange("current")}
        style={[
          styles.segmentButton,
          status === "current" && styles.segmentButtonSelected,
        ]}
      >
        <Text
          style={[
            styles.segmentLabel,
            status === "current" && styles.segmentLabelSelected,
          ]}
        >
          {copy("backlog.status.current")}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("archived")}
        style={[
          styles.segmentButton,
          status === "archived" && styles.segmentButtonSelected,
        ]}
      >
        <Text
          style={[
            styles.segmentLabel,
            status === "archived" && styles.segmentLabelSelected,
          ]}
        >
          {copy("backlog.status.archived")}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.xs,
  },
  segmentButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonSelected: {
    backgroundColor: colors.surface,
  },
  segmentLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600",
  },
  segmentLabelSelected: {
    color: colors.text,
  },
})
