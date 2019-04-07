import { Container } from 'semantic-ui-react';
import React, { Component } from 'react';
import ServantGrid from './ServantGrid';
import ServantData from '../../models/ServantData';
import { ServantFilters, FilterType } from './ServantFilters'
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
    filters: {
      rarity: [] as number[],
      class: [] as string[]
    }
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

  render() {
    const { servant_datas } = this.props;
    const { filters } = this.state;

    return (
      <Container>
        <ServantFilterDropdown servant_datas={servant_datas} type={FilterType.Rarity} value={filters.rarity} onChange={() => {}}/>
        <ServantFilterDropdown servant_datas={servant_datas} type={FilterType.Class} value={filters.class} onChange={() => {}}/>
        <ServantGrid servant_datas={this.filteredServantData()}/>
      </Container>
    );
  }
}