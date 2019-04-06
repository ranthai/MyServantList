import { Container, Dropdown } from 'semantic-ui-react';
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

  private classFilterOptions() {
    const { servant_datas } = this.props

    const classes = servant_datas.map((servant_data) =>
      servant_data.class
    )

    const unique_classes = Array.from(new Set(classes))

    return unique_classes.map((unique_class) => {
      return ({
        key: unique_class,
        text: unique_class,
        value: unique_class
      })
    })
  }

  private renderClassFilter() {
    return (
      this.props.servant_datas
        ? <Dropdown
          placeholder='Class'
          multiple
          search
          selection
          options={this.classFilterOptions()}
        />
        : null
    )
  }

  render() {
    const { servant_datas } = this.props

    return (
      <Container>
        {this.renderClassFilter()}
        <ServantGrid servant_datas={servant_datas}/>
      </Container>
    );
  }
}