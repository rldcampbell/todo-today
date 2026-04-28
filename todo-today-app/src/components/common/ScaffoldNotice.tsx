import { StyleSheet, Text } from 'react-native';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
type ScaffoldNoticeProps = {
  title?: string;
  body: string;
  footer?: string;
};
export const ScaffoldNotice = ({
  title = 'Scaffold state',
  body,
  footer,
}: ScaffoldNoticeProps) => {
  return (
    <SurfaceCard>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </SurfaceCard>
  );
};
const styles = StyleSheet.create({
  title: {
    color: colors.accent,
    fontSize: typography.meta,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  footer: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
