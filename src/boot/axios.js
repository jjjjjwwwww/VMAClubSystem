import { boot } from 'quasar/wrappers';
import axios from 'axios';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: `${process.env.NODE_ENV === 'production' ? 'https://a.com/api/v1/' : 'https://getman.cn/'}`,
  timeout: 3000,
  responseType: 'json',
});
export default boot(({ app, store }) => {
  api.interceptors.request.use(
    (config) => {
      if (store.getters['user/token']) {
        config.headers.common.Authorization = `Bearer ${store.getters['user/token']}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, axios };
