import React from 'react';
import { match, RoutingContext } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

// Routes
import routes from '../common/routes';

// Express
const app = express();
app.engine('html');
//app.set('views', __dirname + '/views');
app.use('/', express.static(__dirname + '/static/'));
app.set('port', (process.env.PORT || 3000));

app.get('*', (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    const reactMarkup = ReactDOMServer.renderToStaticMarkup(<RoutingContext {...renderProps}/>)
    res.locals.reactMarkup = reactMarkup

    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // Success!
      res.status(200).render('index.html')
    } else {
      res.status(404).render('index.html')
    }
  })
});

app.listen(app.get('port'));
console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode');
console.info('==> Go to http://localhost:%s', app.get('port'));
