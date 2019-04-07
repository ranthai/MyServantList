import { Container, DropdownProps } from 'semantic-ui-react';
import React, { Component, SyntheticEvent } from 'react';
import ServantGrid from './ServantGrid';
import ServantData from '../../models/ServantData';
import { ServantFilters, RarityFilters, ClassFilters, FilterType, defaultFilters } from './ServantFilters'
import ServantFilterDropdown from './ServantFilterDropdown'

export interface Props {
  servant_datas: ServantData[],
  loadServantDatas: () => void
}

interface State {
  filters: ServantFilters
}

export default class ServantsPage extends Component<Props, State> {
  state = {
    filters: defaultFilters
  }

  componentDidMount() {
    if (this.props.servant_datas.length === 0)
      this.props.loadServantDatas()
  };

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

  onChange = (type: FilterType) => (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const { filters } = this.state;

    const new_filters = {...filters}

    switch(type) {
      case FilterType.Rarity:
        new_filters.rarity = (data.value as RarityFilters)
        break;
      case FilterType.Class:
        new_filters.class = (data.value as ClassFilters)
    }

    this.setState({filters: new_filters});
  }

  render() {
    const { servant_datas } = this.props;
    const { filters } = this.state;

    return (
      <Container>
        <ServantFilterDropdown servant_datas={servant_datas} type={FilterType.Rarity} value={filters.rarity} onChange={this.onChange(FilterType.Rarity)}/>
        <ServantFilterDropdown servant_datas={servant_datas} type={FilterType.Class} value={filters.class} onChange={this.onChange(FilterType.Class)}/>
        <ServantGrid servant_datas={this.filteredServantData()}/>
      </Container>
    );
  }
}