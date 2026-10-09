import { appBase, restoredPagesPath } from './utils/basePath';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import './styles/home.css';
import './styles/atlas.css';
import './styles/theme.css';
import './styles/upgrade.css';
const restored=restoredPagesPath(window.location.search);
if(restored)window.history.replaceState(null,'',restored);
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter basename={appBase}><App /></BrowserRouter></React.StrictMode>);
import './styles/school.css';

import './styles/living.css';

import './styles/journey.css';
