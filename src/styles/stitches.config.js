import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  theme
} = createStitches({
  theme: {
    colors: {
      background: '#18181b',
      surface: '#23232b',
      accent: '#5eead4',
      primary: '#38bdf8',
      text: '#e2e8f0',
      muted: '#64748b',
      danger: '#ef4444',
      done: '#22c55e'
    },
    space: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px'
    },
    radii: {
      sm: '6px',
      md: '12px'
    }
  }
});
export const globalStyles = globalCss({
  'body': {
    margin: 0,
    backgroundColor: '$background',
    color: '$text',
    fontFamily: 'Inter, sans-serif'
  }
});
