import { useState } from "react"
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native"
import { PillButton } from "@/components/common/PillButton"
import { SurfaceCard } from "@/components/common/SurfaceCard"
import { copy } from "@/copy"
import { formatRecurrenceUnitLabel } from "@/features/tasks/recurrence"
import type { RecurrenceUnit } from "@/features/tasks/task-types"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

const recurrenceUnits: RecurrenceUnit[] = ["day", "week", "month", "year"]

type TaskRecurrenceFieldProps = {
  recurrenceEnabled: boolean
  recurrenceInterval: number
  recurrenceIntervalText: string
  recurrenceUnit: RecurrenceUnit
  onChangeRecurrenceEnabled: (value: boolean) => void
  onChangeRecurrenceIntervalText: (value: string) => void
  onBlurRecurrenceInterval: () => void
  onChangeRecurrenceUnit: (value: RecurrenceUnit) => void
}

export const TaskRecurrenceField = ({
  recurrenceEnabled,
  recurrenceInterval,
  recurrenceIntervalText,
  recurrenceUnit,
  onChangeRecurrenceEnabled,
  onChangeRecurrenceIntervalText,
  onBlurRecurrenceInterval,
  onChangeRecurrenceUnit,
}: TaskRecurrenceFieldProps) => {
  const [showUnitSelector, setShowUnitSelector] = useState(false)

  const handleOpenUnitSelector = () => {
    Keyboard.dismiss()
    setShowUnitSelector(true)
  }

  const handleCloseUnitSelector = () => {
    setShowUnitSelector(false)
  }

  const handleSelectUnit = (value: RecurrenceUnit) => {
    onChangeRecurrenceUnit(value)
    handleCloseUnitSelector()
  }

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {copy("taskSheet.fields.recurrence.label")}
      </Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>
          {copy("taskSheet.fields.recurrence.enabled")}
        </Text>
        <Switch
          onValueChange={onChangeRecurrenceEnabled}
          value={recurrenceEnabled}
        />
      </View>

      {recurrenceEnabled ? (
        <View style={styles.inlineRow}>
          <Text style={styles.inlineText}>
            {copy("taskSheet.fields.recurrence.every")}
          </Text>
          <TextInput
            accessibilityLabel={copy(
              "taskSheet.fields.recurrence.intervalAccessibilityLabel",
            )}
            keyboardType="number-pad"
            maxLength={3}
            onBlur={onBlurRecurrenceInterval}
            onChangeText={onChangeRecurrenceIntervalText}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="done"
            selectTextOnFocus
            style={[styles.input, styles.intervalInput]}
            value={recurrenceIntervalText}
          />
          <Pressable
            accessibilityLabel={copy(
              "taskSheet.fields.recurrence.unitAccessibilityLabel",
            )}
            onPress={handleOpenUnitSelector}
            style={styles.selector}
          >
            <Text style={styles.selectorText}>
              {formatRecurrenceUnitLabel(recurrenceUnit, recurrenceInterval)}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <Modal
        animationType="fade"
        onRequestClose={handleCloseUnitSelector}
        transparent
        visible={showUnitSelector}
      >
        <View style={styles.modalRoot}>
          <Pressable
            onPress={handleCloseUnitSelector}
            style={styles.modalBackdrop}
          />
          <View style={styles.modalContent}>
            <SurfaceCard>
              <View style={styles.optionList}>
                {recurrenceUnits.map((unit) => (
                  <PillButton
                    key={unit}
                    label={formatRecurrenceUnitLabel(unit, recurrenceInterval)}
                    onPress={() => handleSelectUnit(unit)}
                    selected={recurrenceUnit === unit}
                  />
                ))}
              </View>
              <View style={styles.modalActions}>
                <PillButton
                  label={copy("common.actions.done")}
                  onPress={handleCloseUnitSelector}
                />
              </View>
            </SurfaceCard>
          </View>
        </View>
      </Modal>
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  switchLabel: {
    color: colors.text,
    fontSize: typography.body,
  },
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
  },
  inlineText: {
    color: colors.text,
    fontSize: typography.body,
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
  intervalInput: {
    minWidth: 84,
    maxWidth: 84,
    textAlign: "center",
  },
  selector: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  selectorText: {
    color: colors.text,
    fontSize: typography.body,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(36, 33, 23, 0.28)",
  },
  modalContent: {
    zIndex: 1,
  },
  optionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
})
