declare global {
  interface Window {
    fisaEnv?: { API_URL: string }
  }
}

export const BackendUrl = window.fisaEnv?.API_URL || 'http://localhost:8081';

export enum Routes {
  ROOT = '/',
  PROJECT = '/project',
  PAGE_NOT_FOUND = '/404',
}