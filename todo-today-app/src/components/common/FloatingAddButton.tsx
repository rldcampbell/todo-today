import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type FloatingAddButtonProps = {
  onPress: () => void;
};

export function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable
        accessibilityLabel="Add task"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <MaterialIcons color={colors.surface} name="add" size={28} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxxl,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
