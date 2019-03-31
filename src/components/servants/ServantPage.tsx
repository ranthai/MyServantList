import { Container } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantGrid from './ServantGrid';
import ServantData from '../../models/ServantData';

export interface Props {
  servant_datas: ServantData[],
  loadServantDatas: () => void
}

export interface State {

}

export default class ServantsPage extends Component<Props, State> {

  componentDidMount() {
    this.props.loadServantDatas()
  };

  render() {
    const { servant_datas } = this.props

    return (
      <Container>
        <ServantGrid servant_datas={servant_datas}/>
      </Container>
    );
  }
}