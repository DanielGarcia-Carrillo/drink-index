import { recipe } from '@vanilla-extract/recipes';
import { theme } from '../../styles/theme.css';

const buttonStyles = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.base,
    fontWeight: '500',
    transition: 'all 150ms ease',
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: 'white',
        border: 'none',
        ':hover': {
          backgroundColor: theme.colors.primaryHover,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary}`,
        ':hover': {
          backgroundColor: theme.colors.surfaceHover,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: theme.colors.text,
        border: 'none',
        ':hover': {
          backgroundColor: theme.colors.surfaceHover,
        },
      },
    },
    size: {
      sm: {
        height: '32px',
        padding: `0 ${theme.space[3]}`,
        fontSize: theme.fontSizes.sm,
      },
      md: {
        height: '40px',
        padding: `0 ${theme.space[4]}`,
        fontSize: theme.fontSizes.base,
      },
      lg: {
        height: '48px',
        padding: `0 ${theme.space[5]}`,
        fontSize: theme.fontSizes.lg,
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
});

export { buttonStyles }; 