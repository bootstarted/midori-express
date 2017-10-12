# midori-express

Connect your [midori] app to [express].

![build status](http://img.shields.io/travis/metalabdesign/midori-express/master.svg?style=flat)
![coverage](https://img.shields.io/codecov/c/github/metalabdesign/midori-express/master.svg?style=flat)
![license](http://img.shields.io/npm/l/midori-express.svg?style=flat)
![version](http://img.shields.io/npm/v/midori-express.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/midori-express.svg?style=flat)

Install:

```sh
npm install --save express midori midori-express
```

Usage:

```javascript
import express from 'express';
import http from 'http';
import connector from 'midori-express';
import {request, get, send, header, compose} from 'midori';

// Create a midori app.
const basicApp = get('/test', compose(
  header('Content-Type', 'text/plain'),
  send('Hi from midori'),
));
const errorApp = get('/error', request(() => {
  const error = new Error();
  error.statusCode = 418;
  throw error;
}));
const createApp = compose(basicApp, errorApp);

// Create your express app.
const app = express();
// Connect your midori app to your express app.
app.use(connector(createApp));
// Use express as normal.
app.get('/', (req, res) => res.status(200).send('Hi from express.'));
// Start your server.
app.listen();
```

[midori]: https://github.com/metalabdesign/midori
[express]: https://expressjs.com/
