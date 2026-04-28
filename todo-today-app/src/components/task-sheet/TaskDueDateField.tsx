import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PillButton } from '@/components/common/PillButton';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import {
  formatRelativeDueDate,
  parseDayKey,
  getLocalDayKey,
} from '@/utils/dates';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TaskDueDateFieldProps = {
  dueDate: string;
  onChangeDueDate: (value: string) => void;
};

const getDueDateDisplayText = (dueDate: string) => {
  if (dueDate.length === 0) {
    return 'No due date';
  }

  return formatRelativeDueDate(dueDate) ?? 'No due date';
};

export const TaskDueDateField = ({
  dueDate,
  onChangeDueDate,
}: TaskDueDateFieldProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const selectedDate = useMemo(() => {
    return parseDayKey(dueDate) ?? new Date();
  }, [dueDate]);
  const [pickerDate, setPickerDate] = useState(selectedDate);

  const handleOpenPicker = () => {
    Keyboard.dismiss();
    setPickerDate(selectedDate);
    setShowPicker(true);
  };

  const handleClosePicker = () => {
    setShowPicker(false);
  };

  const handleClear = () => {
    handleClosePicker();
    onChangeDueDate('');
  };

  const handleDateChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS === 'android') {
      handleClosePicker();
    }

    if (event.type !== 'set' || !nextDate) {
      return;
    }

    if (Platform.OS === 'ios') {
      setPickerDate(nextDate);
      return;
    }

    onChangeDueDate(getLocalDayKey(nextDate));
  };

  const handleConfirmPicker = () => {
    onChangeDueDate(getLocalDayKey(pickerDate));
    handleClosePicker();
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Due date</Text>

      <Pressable onPress={handleOpenPicker} style={styles.displayField}>
        <Text
          style={[
            styles.displayText,
            dueDate.length === 0 && styles.displayTextEmpty,
          ]}
        >
          {getDueDateDisplayText(dueDate)}
        </Text>
      </Pressable>

      {dueDate.length > 0 ? (
        <View style={styles.actions}>
          <PillButton label="Clear" onPress={handleClear} />
        </View>
      ) : null}

      {showPicker && Platform.OS === 'android' ? (
        <DateTimePicker
          display="default"
          mode="date"
          onChange={handleDateChange}
          value={selectedDate}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          animationType="fade"
          onRequestClose={handleClosePicker}
          transparent
          visible={showPicker}
        >
          <View style={styles.modalRoot}>
            <Pressable
              onPress={handleClosePicker}
              style={styles.modalBackdrop}
            />
            <View style={styles.modalContent}>
              <SurfaceCard>
                <Text style={styles.modalTitle}>Due date</Text>
                <DateTimePicker
                  display="inline"
                  mode="date"
                  onChange={handleDateChange}
                  value={pickerDate}
                />
                <View style={styles.actions}>
                  {dueDate.length > 0 ? (
                    <PillButton label="Clear" onPress={handleClear} />
                  ) : null}
                  <PillButton label="Cancel" onPress={handleClosePicker} />
                  <PillButton label="Done" onPress={handleConfirmPicker} />
                </View>
              </SurfaceCard>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  displayField: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  displayText: {
    color: colors.text,
    fontSize: typography.body,
  },
  displayTextEmpty: {
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(36, 33, 23, 0.28)',
  },
  modalContent: {
    zIndex: 1,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
