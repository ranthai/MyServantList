import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react'

class NavBar extends Component {
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
        <Dropdown item text='Tools'>
          <Dropdown.Menu>
            <Dropdown.Item>Material</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item
          name='About'
          as={Link} to='/about'/>
      </Menu>
    );
  }
}

export default NavBar;