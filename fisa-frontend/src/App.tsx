import React, { Suspense } from 'react';
import { CssBaseline } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppRouter from './AppRouter';

function App() {
  return (
    <CssBaseline>
      <Suspense fallback="loading">
        <Provider store={store}>
          <AppRouter />
        </Provider>
      </Suspense>
    </CssBaseline>
  );
}

export default App;
