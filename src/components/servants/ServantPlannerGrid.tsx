import { Grid } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantCard from './ServantCard';
import Servant from '../../models/Servant';

interface Props {
  servants: Servant[]
}

export default class ServantPlannerGrid extends Component<Props, {}> {

  render() {
    const { servants } = this.props

    return (
      <Grid padded centered doubling stackable columns={8}>
        {servants.map((servant) => {
          return (
            <Grid.Column key={servant.id}>
              <ServantCard
                servant={servant}/>
            </Grid.Column>
          )
        })}
      </Grid>
    )
  }
}