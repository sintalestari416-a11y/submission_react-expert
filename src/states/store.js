/**
 * states/store.js
 * Konfigurasi Redux Store utama.
 * Mengintegrasikan loadingBarReducer dari react-redux-loading-bar.
 */

import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import authUserReducer from './authUser';
import isPreloadReducer from './isPreload';
import usersReducer from './users';
import threadsReducer from './threads';
import threadDetailReducer from './threadDetail';
import leaderboardsReducer from './leaderboards';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    loadingBar: loadingBarReducer,
  },
});

export default store;
