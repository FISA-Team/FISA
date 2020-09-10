import React, { ReactChild } from 'react';
import Menu from '@material-ui/core/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  IconButton,
  AppBar,
  Toolbar,
  Tooltip,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from './logo.svg';

import ThemeOverview from './ThemeOverview';
import { Routes } from '../../environment';

interface BaseMenuProps {
  // eslint-disable-next-line react/require-default-props
  children?: ReactChild;
}

export default function BaseMenu(props: BaseMenuProps = { children: <></> }) {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Link to={Routes.ROOT} style={{ textDecoration: 'none' }}>
          <Button
            style={{
              padding: 0,
              margin: 0,
              height: 60,
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <img src={logo} alt="logo" style={{ height: 55, margin: 2 }} />
          </Button>
        </Link>
        <div style={{ marginLeft: 'auto' }} />
        {props.children}
        <ThemeMenu />
      </Toolbar>
    </AppBar>
  );
}

function ThemeMenu() {
  const [ancorEl, setAnchorEl] = React.useState<Element | null>(null);
  const { t } = useTranslation('menus');

  const handleThemeMenuClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const closeThemeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={`${t('settingsTooltip')}`}>
        <IconButton
          id="themeLanguageMenu"
          key="themeMenu"
          color="inherit"
          onClick={handleThemeMenuClick}
          edge="start"
        >
          <SettingsIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Menu
        id="themeMenu"
        anchorEl={ancorEl}
        open={Boolean(ancorEl)}
        onClose={closeThemeMenu}
      >
        <ThemeOverview closeMenu={() => closeThemeMenu()} />
      </Menu>
    </>
  );
}
