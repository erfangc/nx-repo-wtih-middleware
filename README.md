# Angular Project with Middleware

## Background and Problem Statement this Sample Repo Solves

This project contains an angular application under `/apps/myapp`, during local development we'd like to run all static asset, API calls on the same domain ("localhost:4300") to simulate production where this websites and the APIs that supports it will all be hosted under "some-example.com"

For example the SPA might be on "some-example.com/myapp" while parts of the app calls the API "some-example.com/api/users"

We also want to be aware of the following:

- User must be authenticated to access "/myapp" or "/api/users" or really anything
- Thus we want our port 4300 server to check for an `Authorization: ` header in all HTTP requests and 302 to a sign in URL if this header cannot be found
- The above behavior should happen in localhost development as well as when deployed

## Solution

See that we have a `server.js` at the root of the repository, and a `package.json` script called `start:proxy`:

```json
  "scripts": {
    "start:proxy": "node server.js"
  }
```

`server.js` contain the following logic:

```js
// Middleware for authentication check
app.use(function (req, res, next) {
  var auth = req.header('Authorization');
  if (!auth || auth !== 'Basic 123') {
    // THIS IS WHERE YOU INSERT LOGIC
    // res.redirect(`https://login.mycompany.com?redirectUrl=localhost:4300`);
    // return;
  }
  next();
});

// Proxy configuration
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://api.mycompany.com',
    changeOrigin: true,
    secure: false,
  })
);

app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:4200',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
  })
);
```

Thus, to run locally you should run:

```bash
nx serve my app # to run the app on 4200 as usual
```

Then,

```bash
npm run start:proxy # to run another NodeJS server on 4300 that will forward to 4200 once the user has authenticated or else redirect to sign in page and redirect to localhost:4300 again
```
