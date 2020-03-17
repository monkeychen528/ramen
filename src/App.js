import React, { Suspense, lazy } from 'react';
import './asset/App.css';
import 'bootstrap';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Comment from './components/Comment';

const ContentIndex = lazy(() => import('./components/ContentIndex'));
const Contacts = lazy(() => import('./components/Contacts'));
const MapIndex = lazy(() => import('./components/MapIndex'));

// react 新渲染功能套件lazy,Suspense(裡面是放callback如果loading就套用callback裡的套件)
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={ContentIndex} />
          <Route exact path="/contacts" component={Contacts} />
          <Route exact path="/ramenMap" component={MapIndex} />
          <Route exact path="/comment" component={Comment} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
