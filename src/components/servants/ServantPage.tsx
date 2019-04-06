import { Container, Dropdown } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantGrid from './ServantGrid';
import ServantData, { ServantFilters } from '../../models/ServantData';

export interface Props {
  servant_datas: ServantData[],
  loadServantDatas: (filters: ServantFilters) => void
}

export default class ServantsPage extends Component<Props, ServantFilters> {
  state = {
    class_filters: []
  }

  componentDidMount() {
    this.props.loadServantDatas(this.state)
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
    const { servant_datas } = this.props
    const { class_filters } = this.state

    return (
      servant_datas
        ? <Dropdown
          placeholder='Class'
          multiple
          search
          selection
          clearable
          options={this.classFilterOptions()}
          onChange={(event, data) => {
            this.setState({class_filters: (data.value as string[])});
          }}
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