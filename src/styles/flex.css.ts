import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const row = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
  },
  variants: {
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
  },
  defaultVariants: {
    justify: 'start',
    align: 'center',
  },
});

export const column = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
  },
  defaultVariants: {
    align: 'stretch',
    justify: 'start',
  },
}); 