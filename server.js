const express = require('express')
const app = express()
const port = 3000
const router = require('./routes/routes');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'Issues florence',
    license: {
      name: 'Florence',
    },
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },
  filesPattern: './controller/*.js', // Glob pattern to find your jsdoc files (it supports arrays too ['./**/*.controller.js', './**/*.route.js'])
  swaggerUIPath: '/api-docs', // SwaggerUI will be render in this url. Default: '/api-docs'
  baseDir: __dirname,
  exposeSwaggerUI: true, // Expose OpenAPI UI. Default true
  exposeApiDocs: false, // Expose Open API JSON Docs documentation in `apiDocsPath` path. Default false.
  apiDocsPath: '/api/issues', // Open API JSON Docs endpoint. Default value '/v3/api-docs'.
};

expressJSDocSwagger(app)(options);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/issues', router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;