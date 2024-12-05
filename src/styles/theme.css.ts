import { createGlobalTheme } from '@vanilla-extract/css';
import {
  blue,
  slate,
  green,
  red,
  amber,
} from '@radix-ui/colors';
import type { ThemeTokens } from './theme.types';

export const theme = createGlobalTheme<ThemeTokens>(':root', {
  colors: {
    background: '#ffffff',
    text: slate.slate12,
    textMuted: slate.slate11,
    primary: blue.blue9,
    primaryHover: blue.blue10,
    success: green.green9,
    error: red.red9,
    warning: amber.amber9,
    surface: '#ffffff',
    surfaceHover: slate.slate3,
    surfaceActive: slate.slate4,
    surfaceMuted: slate.slate2,
    border: slate.slate6,
    borderHover: slate.slate7,
  },
  space: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '24px',
    6: '32px',
    8: '48px',
    10: '64px',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
}); 