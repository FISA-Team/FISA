import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme, Theme } from '@material-ui/core';
import { MainPage, ProjectPage, NotFoundPage } from './pages';
import { getTheme } from './redux/selectors';
import { FrontendReduxStateI } from './redux/interfaces';
import { Routes } from './environment';

interface AppRouterProps {
  theme: Theme;
}

function AppRouter(props: AppRouterProps) {
  const muiTheme = createMuiTheme(props.theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Router>
        <Switch>
          <Route path={Routes.ROOT} exact component={MainPage} />
          <Route path={Routes.PROJECT} exact component={ProjectPage} />
          <Route path={Routes.PAGE_NOT_FOUND} component={NotFoundPage} />
          <Redirect to={Routes.PAGE_NOT_FOUND} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

const mapStateToProps = (state: FrontendReduxStateI) => ({
  theme: getTheme(state),
});

export default connect(mapStateToProps)(AppRouter);
