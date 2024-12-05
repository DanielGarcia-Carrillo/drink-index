import { style } from '@vanilla-extract/css';
import { theme } from '../../styles/theme.css';

const root = style({
  position: 'sticky',
  top: 0,
  backgroundColor: theme.colors.background,
  borderBottom: `1px solid ${theme.colors.border}`,
  padding: `${theme.space[4]} 0`,
  zIndex: 10,
});

const list = style({
  display: 'flex',
  gap: theme.space[6],
  margin: 0,
  padding: `0 ${theme.space[4]}`,
  listStyle: 'none',
});

const link = style({
  color: theme.colors.text,
  fontSize: theme.fontSizes.base,
  textDecoration: 'none',
  padding: theme.space[2],
  borderRadius: theme.radii.md,
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: theme.colors.surfaceHover,
  },
});

export const navigationStyles = {
  root,
  list,
  link,
}; 