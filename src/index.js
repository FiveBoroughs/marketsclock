import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'fomantic-ui-less/semantic.less';
import * as serviceWorker from './serviceWorker';
import WebFont from 'webfontloader';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

import App from './App';

WebFont.load({
    google: {
        families: ['Montserrat:300,400,500,800', 'Fira Mono:400,700']
    }
});

const matomoInstance = createInstance({
    urlBase: "https://a.pinescripters.io/",
    siteId: 4, // optional, default value: `1`
    trackerUrl: "https://a.pinescripters.io/matomo.php", // optional, default value: `${urlBase}matomo.php`
    srcUrl: "https://a.pinescripters.io/matomo.js" // optional, default value: `${urlBase}matomo.js`
});


ReactDOM.render(
    <MatomoProvider value={matomoInstance}>
        <App />
    </MatomoProvider>
    , document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
