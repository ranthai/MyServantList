import { Grid } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantCard from './ServantCard';
import ServantData from '../../models/ServantData';

interface Props {
  servant_datas: ServantData[]
}

export default class ServantGrid extends Component<Props, {}> {

  render() {
    const { servant_datas } = this.props

    return (
      <Grid padded centered doubling stackable columns={8}>
        {servant_datas.map((servant_data) => {
          return (
            <Grid.Column key={servant_data.id}>
              <ServantCard
                servant_data={servant_data}
              />
            </Grid.Column>
          )
        })}
      </Grid>
    )
  }
}