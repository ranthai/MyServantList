import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';
import App from './App';
import ServantPage from '../servants/ServantPage';
import CraftEssences from './CraftEssences';
import ServantPlanner from '../servantplanner/ServantPlanner';
import About from './About';
import ServantData, { ServantFilters } from '../../models/ServantData';
import { callApi } from '../servants/ServantApi'

export interface Props {

}

export interface State {
  servant_datas: ServantData[]
}

export default class Router extends Component<Props, State> {
  state = {
    servant_datas: []
  }

  loadServantDatas = () => {
    callApi()
    .then((servant_datas: ServantData[]) => {
      this.setState({
        servant_datas: servant_datas
      })
    })
  }

  render() {
    const { servant_datas } = this.state

    return (
      <BrowserRouter>
        <div>
          <NavBar/>
          <Route exact path='/' component={App}/>
          <Route path='/servants' render={() =>
            <ServantPage servant_datas={servant_datas} loadServantDatas={this.loadServantDatas}/>}
          />
          <Route path='/craftessences' component={CraftEssences}/>
          {/* <Route path='/servantplanner' render={() =>
            <ServantPlanner servant_datas={servant_datas} loadServantDatas={this.loadServantDatas}/>}
          /> */}
          <Route path='/about' component={About}/>
        </div>
      </BrowserRouter>
    );
  }
}