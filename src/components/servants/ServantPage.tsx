import { Container } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantGrid from './ServantGrid';
import Servant from '../../models/Servant';

// todo fix types
export interface Props {
  servants: Servant[],
  addServants: (servants: Servant[]) => void
}

export interface State {

}

export default class ServantsPage extends Component<Props, State> {

  public componentDidMount() {
    this.loadServants()
  };

  public loadServants() {
    this.callApi()
    .then((servants: Servant[]) => {
      this.props.addServants(servants);
    })
    .catch(Error);
  }

  public callApi = async () => {
    const response = await fetch(`/api/servants/`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const { servants } = this.props

    return (
      <div>
        <Container>
          <ServantGrid
            servants={servants}/>
        </Container>
      </div>
    );
  }
}