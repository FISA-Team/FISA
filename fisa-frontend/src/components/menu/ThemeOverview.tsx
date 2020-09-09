import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import * as themes from '../../themes';
import { setTheme } from '../../redux/actions/pageActions';
import { getThemeName } from '../../redux/selectors';
import { FrontendReduxStateI, ActionI } from '../../redux/interfaces';

import { LANGUAGE } from '../../variables/localeStoreageKeys';
import { LANGUAGES } from '../../variables/variables';

const ThemeOverviewStyle = makeStyles(() => ({
  radioButton: {
    paddingLeft: '25px',
  },
  label: {
    paddingLeft: '15px',
  },
}));

interface ThemeOverviewProps {
  closeMenu: () => void;
  dispatch: Dispatch<ActionI>;
  themeName: string;
}

const ThemeOverview = (props: ThemeOverviewProps) => {
  const classes = ThemeOverviewStyle();
  const [t, i18n] = useTranslation('general');

  const changeTheme = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    props.closeMenu();
    props.dispatch(setTheme(value));
  };

  const changeLanguage = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    props.closeMenu();
    i18n.changeLanguage(value);
    localStorage.setItem(LANGUAGE, value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel className={classes.label} component="legend">
        {t('themeHeading')}
      </FormLabel>
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={props.themeName}
        onChange={changeTheme}
      >
        {Object.keys(themes).map((theme) => (
          <FormControlLabel
            key={theme}
            value={theme}
            control={<Radio />}
            label={theme}
            className={classes.radioButton}
          />
        ))}
      </RadioGroup>
      <FormLabel className={classes.label} component="legend">
        {t('langugesHeading')}
      </FormLabel>
      <RadioGroup
        aria-label="gender2"
        name="gender2"
        value={i18n.language}
        onChange={changeLanguage}
      >
        {LANGUAGES.map((lng) => (
          <FormControlLabel
            key={lng}
            value={lng}
            control={<Radio />}
            label={lng.toUpperCase()}
            className={classes.radioButton}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const mapStateToProps = (state: FrontendReduxStateI) => ({
  themeName: getThemeName(state),
});

export default connect(mapStateToProps)(ThemeOverview);
