// @flow

import type {AppCreator} from 'midori/types';

export default (createApp: AppCreator): Function => {
  const nextSymbol = Symbol('next');
  const middleware = createApp({
    error: (err, req) => {
      if (req) {
        req[nextSymbol](err);
      }
    },
    request: (req) => {
      req[nextSymbol]();
    },
  });
  return (req: any, res: any, next: any) => {
    req[nextSymbol] = next;
    middleware.request(req, res);
  };
};
