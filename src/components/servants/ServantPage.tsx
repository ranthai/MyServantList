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
      rarity: [] as number[],
      class: [] as string[]
    }
  }

  componentDidMount() {
    if (this.props.servant_datas.length === 0)
      this.props.loadServantDatas()
  };


  private rarityFilterOptions() {
    const { servant_datas } = this.props

    const rarities = servant_datas.map((servant_data) =>
      servant_data.rarity
    )

    const unique = Array.from(new Set(rarities)).sort()

    return unique.map((filter) => {
      return ({
        key: filter,
        text: filter,
        value: filter
      })
    })
  }


  private renderRarityFilter() {
    const { servant_datas } = this.props
    const { filters } = this.state

    return (
      servant_datas.length !== 0
        ? <Dropdown
            placeholder='Rarity'
            multiple
            search
            selection
            clearable
            options={this.rarityFilterOptions()}
            value={filters.rarity}
            onChange={(event, data) => {
              const new_filters = {...filters, rarity: (data.value as number[])}
              this.setState({filters: new_filters});
            }}
          />
        : null
    )
  }

  private classFilterOptions() {
    const { servant_datas } = this.props

    const classes = servant_datas.map((servant_data) =>
      servant_data.class
    )

    const unique = Array.from(new Set(classes)).sort()

    return unique.map((filter) => {
      return ({
        key: filter,
        text: filter,
        value: filter
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
            value={filters.class}
            onChange={(event, data) => {
              const new_filters = {...filters, class: (data.value as string[])}
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

    if (filters.rarity.length !== 0)
      filtered = filtered.filter((servant) =>{
        return filters.rarity.includes(servant.rarity)
      })

    if (filters.class.length !== 0)
      filtered = filtered.filter((servant) =>{
        return filters.class.includes(servant.class)
      })

    return filtered
  }

  render() {
    const { servant_datas } = this.props;
    const { filters } = this.state;

    return (
      <Container>
        {this.renderRarityFilter()}
        {this.renderClassFilter()}
        <ServantGrid servant_datas={this.filteredServantData()}/>
      </Container>
    );
  }
}