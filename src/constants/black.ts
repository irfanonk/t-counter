import {
  ITheme,
  ThemeColors,
  ThemeGradients,
  ThemeSizes,
  ThemeSpacing,
} from './types';

import {THEME as commonTheme} from './theme';

export const COLORS: ThemeColors = {
  // default text color
  text: '#B0B8B4', // Softer gray for readability on dark background

  // base colors
  primary: '#1A1F16', // A slightly darker black-green for primary UI areas
  secondary: '#353835', // Muted dark gray-green for secondary elements
  tertiary: '#7D857E', // Subtle gray-green for tertiary accents

  // non-colors
  black: '#0D0D0D', // Deep black for contrastdasd
  white: '#FFFFFF',

  dark: '#181C14',
  light: '#4A4E46', // Lighter gray for highlights

  // gray variations
  gray: '#7A807A', // Neutral gray for borders and less prominent text

  // colors variations
  danger: '#FF5C5C', // Vibrant red for errors
  warning: '#FFC857', // Bright yellow-orange for warnings
  success: '#78E08F', // Fresh green for success
  info: '#1EAEFC', // Bright blue for information

  // navigation & card colors
  card: '#1A1F16',
  background: '#121212', // A slightly lighter black for main background

  // shadow and overlays
  shadow: 'rgba(0,0,0,0.7)',
  overlay: 'rgba(0,0,0,0.5)',

  // input colors
  focus: '#6A5ACD', // Strong focus indicator color
  input: '#B0B8B4', // Darker gray for input background

  // switch colors
  switchOn: '#9fc493', // Green for active state
  switchOff: '#3C3D37', // Muted gray for inactive state

  // checkbox colors
  checkbox: ['#37474F', '#263238'], // Dark gray tones for checkboxes
  checkboxIcon: '#FFFFFF',

  // social colors
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  dribbble: '#E94E77',

  // icon tint
  icon: '#E0E0E0', // Softer white for icons

  // blur tint
  blurTint: 'dark',

  // product link color
  link: '#E91E63', // Bright pink for links
};

export const GRADIENTS: ThemeGradients = {
  primary: ['#282828', '#383838'], // Subtle black gradient
  secondary: ['#3C3D37', '#484848'], // Gray gradient
  info: ['#1E90FF', '#1EAEFC'], // Blue gradient for information
  success: ['#56AB2F', '#A8E063'], // Green gradient for success
  warning: ['#FFC857', '#FFD580'], // Yellow-orange gradient
  danger: ['#FF5C5C', '#FF3B3B'], // Vibrant red gradient

  light: ['#4A4E46', '#7A807A'], // Softer gray gradients
  dark: ['#0D0D0D', '#181C14'], // Deep dark gradients

  white: [String(COLORS.white), '#F0F0F0'], // Light gradients
  black: [String(COLORS.black), '#181C14'], // Dark gradients

  divider: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'], // Subtle divider
  menu: [
    'rgba(255, 255, 255, 0.1)',
    'rgba(112, 125, 149, 0.3)',
    'rgba(255, 255, 255, 0.1)',
  ],
};

export const THEME: ITheme = {
  ...commonTheme,
  colors: COLORS,
  gradients: GRADIENTS,
};
