import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';
import App from './App';
import ServantPage from '../containers/ServantPage';
import CraftEssences from './CraftEssences';
import About from './About';

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar/>
          <Route exact path='/' component={App}/>
          <Route path='/servants' component={ServantPage}/>
          <Route path='/craftessences' component={CraftEssences}/>
          <Route path='/about' component={About}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default Router;