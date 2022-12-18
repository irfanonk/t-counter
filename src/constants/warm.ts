import {
    ITheme,
    ThemeColors,
    ThemeGradients,
    ThemeSizes,
    ThemeSpacing,
} from './types';

import { THEME as commonTheme } from './theme';

export const COLORS: ThemeColors = {
    // default text color
    text: '#CE9461',

    // base colors
    /** UI color for #primary */
    primary: '#FCFFE7',
    /** UI color for #secondary */
    secondary: '#DEA057', // '#8392AB',
    /** UI color for #tertiary */
    tertiary: '#E8AE4C',

    // non-colors
    black: '#252F40',
    white: '#FFFFFF',

    dark: '#252F40',
    light: '#E9ECEF',

    // gray variations
    /** UI color for #gray */
    gray: '#A7A8AE',

    // colors variations
    /** UI color for #danger */
    danger: '#EA0606',
    /** UI color for #warning */
    warning: '#FFC107',
    /** UI color for #success */
    success: '#1E5128',
    /** UI color for #info */
    info: '#17C1E8',

    /** UI colors for navigation & card */
    card: '#FFFFFF',
    background: '#E0D8B0',

    /** UI color for shadowColor */
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.3)',

    /** UI color for input borderColor on focus */
    focus: '#FCFFE7',
    input: '#CE9461',

    /** UI color for switch checked/active color */
    switchOn: '#3A416F',
    switchOff: '#ECDBBA',

    /** UI color for checkbox icon checked/active color */
    checkbox: ['#3A416F', '#141727'],
    checkboxIcon: '#FFFFFF',

    /** social colors */
    facebook: '#3B5998',
    twitter: '#55ACEE',
    dribbble: '#EA4C89',

    /** icon tint color */
    icon: '#8392AB',

    /** blur tint color */
    blurTint: 'default',

    /** product link color */
    link: '#CB0C9F',
};
export const GRADIENTS: ThemeGradients = {
    primary: ['#FF0080', '#7928CA'],
    secondary: ['#A8B8D8', '#627594'],
    info: ['#21D4FD', '#2152FF'],
    success: ['#98EC2D', '#17AD37'],
    warning: ['#FBCF33', '#F53939'],
    danger: ['#FF667C', '#EA0606'],

    light: ['#EBEFF4', '#CED4DA'],
    dark: ['#3A416F', '#141727'],

    white: [String(COLORS.white), '#EBEFF4'],
    black: [String(COLORS.black), '#141727'],

    divider: ['rgba(255,255,255,0.3)', 'rgba(102, 116, 142, 0.6)'],
    menu: [
        'rgba(255, 255, 255, 0.2)',
        'rgba(112, 125, 149, 0.5)',
        'rgba(255, 255, 255, 0.2)',
    ],
};



export const THEME: ITheme = {
    ...commonTheme,
    colors: COLORS,
    gradients: GRADIENTS,
};
