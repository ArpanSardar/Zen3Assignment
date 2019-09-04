import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Workitem from './components/WorkItemDashBoard';
import ProcessConfigDetails from './components/ProcessConfigDetails';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Header />
      <div className='container'>
        <Switch>
          <Route exact path='/' component={Workitem} />
          <Route path='/config' component={ProcessConfigDetails} />
          <Route
            component={() => (
              <div>
                <h1>Invalid route</h1>
              </div>
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
