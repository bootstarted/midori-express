import {request as handle, expect} from 'chai';
import express from 'express';
import http from 'http';
import connector from '../../src';
import {request, get, send, header, compose} from 'midori';

const basicApp = get('/test', compose(
  header('Content-Type', 'text/plain'),
  send('Test'),
));
const errorApp = get('/error', request(() => {
  const error = new Error();
  error.status = 418;
  throw error;
}));
const createApp = compose(basicApp, errorApp);

describe('express', () => {
  let server;
  let app;

  beforeEach((done) => {
    app = express();
    app.use(connector(createApp));
    app.get('/', (req, res) => res.status(200).send('No'));
    server = http.createServer(app);
    server.listen(done);
  });

  afterEach((done) => {
    server.close(done);
  });

  describe('normal', () => {
    it('should return a result', () => {
      return handle(server).get('/test').then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Test');
      });
    });

    it('should bubble handlers', () => {
      return handle(server).get('/').then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('No');
      });
    });
  });

  describe('errors', () => {
    it('should bubble errors', () => {
      return handle(server).get('/error').then((res) => {
        expect(res).to.have.status(418);
      });
    });
  });
});
