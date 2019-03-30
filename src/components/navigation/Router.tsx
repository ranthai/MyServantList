import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';
import App from './App';
import ServantPage from '../servants/ServantPage';
import CraftEssences from './CraftEssences';
import ServantPlanner from '../servants/ServantPlanner';
import About from './About';
import Servant from '../../models/Servant';
import { callApi } from '../servants/ServantApi'

export interface Props {

}

export interface State {
  servants: Servant[]
}

export default class Router extends Component<Props, State> {
  state = {
    servants: []
  }

  loadServants = () => {
    callApi()
    .then((servants: Servant[]) => {
      this.setState({
        servants: servants
      })
    })
  }

  render() {
    const { servants } = this.state

    return (
      <BrowserRouter>
        <div>
          <NavBar/>
          <Route exact path='/' component={App}/>
          <Route path='/servants' render={() =>
            <ServantPage servants={servants} loadServants={this.loadServants}/>}/>
          <Route path='/craftessences' component={CraftEssences}/>
          <Route path='/servantplanner' render={() =>
            <ServantPlanner servants={servants} loadServants={this.loadServants}/>}/>
          <Route path='/about' component={About}/>
        </div>
      </BrowserRouter>
    );
  }
}