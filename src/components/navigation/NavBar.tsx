import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'

export default class NavBar extends Component {
  render() {
    return (
      <Menu pointing secondary>
        <Menu.Item
          name='MyServantList'
          as={Link} to='/'/>
        <Menu.Item
          name='Servants'
          as={Link} to='/servants'/>
        <Menu.Item
          name='Craft Essences'
          as={Link} to='/craftessences'/>
        <Menu.Item
          name='Servant Planner'
          as={Link} to='/servantplanner'/>
        <Menu.Item
          name='About'
          as={Link} to='/about'/>
      </Menu>
    );
  }
}