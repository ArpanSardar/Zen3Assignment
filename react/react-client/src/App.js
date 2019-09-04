import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WorkItemDashBoard from './components/WorkItemDashBoard';
import ProcessConfigDetails from './components/ProcessConfigDetails';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Switch>
        {/* <Route exact path='/' component={WorkItemDashBoard} /> */}
        <Route path='/' component={ProcessConfigDetails} />
        <Route
          component={() => (
            <div>
              <h1>Invalid route</h1>
            </div>
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
