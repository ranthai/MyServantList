import { Container, Dropdown, Button } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantGrid from './ServantGrid';
import ServantData, { ServantFilters } from '../../models/ServantData';

export interface Props {
  servant_datas: ServantData[],
  loadServantDatas: () => void
}

interface State {
  filters: ServantFilters
}

export default class ServantsPage extends Component<Props, State> {
  state = {
    filters: {
      class_filters: [] as string[]
    }
  }

  componentDidMount() {
    if (this.props.servant_datas.length === 0)
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
    const { servant_datas } = this.props
    const { filters } = this.state

    return (
      servant_datas.length !== 0
        ? <Dropdown
            placeholder='Class'
            multiple
            search
            selection
            clearable
            options={this.classFilterOptions()}
            value={filters.class_filters}
            onChange={(event, data) => {
              const new_filters = {...filters, class_filters: (data.value as string[])}
              this.setState({filters: new_filters});
            }}
          />
        : null
    )
  }

  private filteredServantData() {
    const { servant_datas } = this.props;
    const { filters } = this.state;

    var filtered = servant_datas;

    if (filters.class_filters.length !== 0)
      filtered = filtered.filter((servant) =>{
        return filters.class_filters.includes(servant.class)
      })

    return filtered
  }

  render() {
    const { servant_datas } = this.props;
    const { filters } = this.state;

    return (
      <Container>
        {this.renderClassFilter()}
        <ServantGrid servant_datas={this.filteredServantData()}/>
      </Container>
    );
  }
}