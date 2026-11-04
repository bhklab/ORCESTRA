require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./routes/router');
const db = require('./db/mongoose');

const listen = () => {
  app.listen(port, ()=>{
    console.log('Server running on port: ' + port);
  });
}

app.use(cors());

// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cookieParser());
app.set('js', path.join(__dirname, 'js'));

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const getOpenapiSpec = () => YAML.load(path.join(__dirname, 'openapi.yaml'));

app.use('/api/docs', swaggerUi.serve, (req, res, next) => {
    swaggerUi.setup(getOpenapiSpec(), {
        customSiteTitle: 'ORCESTRA API Documentation'
    })(req, res, next);
});
app.get('/api/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(getOpenapiSpec());
});
app.get('/api/openapi.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, 'openapi.yaml'));
});
app.get('/api/docs', (req, res) => res.redirect('/api/docs/'));
app.get('/api', (req, res) => res.redirect('/api/docs/'));
app.get('/docs', (req, res) => res.redirect('/api/docs/'));

app.use('/api', router);

// Handle unmatched /api routes with a clean JSON 404 response
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found', path: req.originalUrl });
});

// configure express to use public folder
const fs = require('fs');
const clientBuildPath = path.join(__dirname, '/client/build');
const clientIndexHtml = path.join(clientBuildPath, 'index.html');

app.use(express.static(clientBuildPath)); 

app.get('/*', (req, res) => {
    if (fs.existsSync(clientIndexHtml)) {
        res.sendFile('index.html', { root: clientBuildPath });
    } else {
        res.status(404).send('Client build not found. In development, access the client app on http://localhost:3000');
    }
});

var port = process.env.PORT || '2000';
app.set('port', port);

// database connection setting.
db.connection
    .on('error', console.log)
    .on('disconnected', db.connect)
    .once('open', listen);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', db.gracefulExit).on('SIGTERM', db.gracefulExit);

module.exports = app; // for testing