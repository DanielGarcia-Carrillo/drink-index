import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { theme } from './theme.css';

export const container = style({
  width: '100%',
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: `${theme.space[8]} ${theme.space[4]}`,
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.space[8],
});

export const grid = recipe({
  base: {
    display: 'grid',
    gap: theme.space[4],
  },

  variants: {
    columns: {
      1: {
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      },
      2: {
        '@media': {
          'screen and (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
        },
      },
      3: {
        '@media': {
          'screen and (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
          'screen and (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          },
        },
      },
      4: {
        '@media': {
          'screen and (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
          'screen and (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          },
        },
      },
    },
    gap: {
      small: { gap: theme.space[4] },
      medium: { gap: theme.space[6] },
      large: { gap: theme.space[8] },
    },
  },

  defaultVariants: {
    gap: 'medium',
  },
}); 