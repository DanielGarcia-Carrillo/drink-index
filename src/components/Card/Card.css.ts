import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { theme } from '../../styles/theme.css';

const base = style({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radii.lg,
  border: `1px solid ${theme.colors.border}`,
  transition: 'all 150ms ease',
  overflow: 'hidden',
  ':hover': {
    borderColor: theme.colors.borderHover,
    boxShadow: theme.shadows.md,
  },
});

const header = style({
  padding: theme.space[4],
  borderBottom: `1px solid ${theme.colors.border}`,
});

const content = style({
  padding: theme.space[4],
});

const footer = style({
  padding: theme.space[4],
  borderTop: `1px solid ${theme.colors.border}`,
});

const title = style({
  fontSize: theme.fontSizes.lg,
  fontWeight: '600',
  color: theme.colors.text,
  margin: 0,
});

const description = style({
  fontSize: theme.fontSizes.base,
  color: theme.colors.textMuted,
  marginTop: theme.space[2],
});

export const cardStyles = {
  base,
  header,
  content,
  footer,
  title,
  description,
}; 