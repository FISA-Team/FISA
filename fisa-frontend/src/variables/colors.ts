import { Theme } from '@material-ui/core';

export const WHITE = '#e6e6e6';
export const WHITE_HIGHLIGHT = '#d9d9d9';
export const GREY = '#373d48';
export const GREY_HIGHLIGHT = '#434a56';
export const BLUE = '#3f51b5';

export const getBackgroundColor = (theme: Theme) =>
  theme.palette.type === 'dark' ? GREY : WHITE;

export const getHighlightBackgroundColor = (theme: Theme) =>
  theme.palette.type === 'dark' ? GREY_HIGHLIGHT : WHITE_HIGHLIGHT;
