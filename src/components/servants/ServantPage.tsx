import { Container } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantGrid from './ServantGrid';
import Servant from '../../models/Servant';

export interface Props {
  servants: Servant[],
  loadServants: () => void
}

export interface State {

}

export default class ServantsPage extends Component<Props, State> {

  componentDidMount() {
    this.props.loadServants()
  };

  render() {
    const { servants } = this.props

    return (
      <Container>
        <ServantGrid servants={servants}/>
      </Container>
    );
  }
}