import React, { Component, SyntheticEvent } from 'react';
import ServantData from '../../models/ServantData';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { FilterType } from './ServantFilters';

export interface Props {
  servant_datas: ServantData[],
  type: FilterType,
  value: any[]
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
}

export default class ServantFilter extends Component<Props, {}> {
  filterOptions() {
    const { servant_datas, type } = this.props

    const datas = servant_datas.map((servant_data) => {
      switch(type) {
        case FilterType.Rarity:
          return servant_data.rarity;
        case FilterType.Class:
          return servant_data.class;
      }
    })

    const unique = Array.from(new Set(datas)).sort()

    return unique.map((filter) => {
      return ({
        key: filter,
        text: filter,
        value: filter
      })
    })
  }

  render() {
    const { servant_datas, type, value, onChange } = this.props

    return (
      servant_datas.length !== 0
        ? <Dropdown
            placeholder='Class'
            multiple
            search
            selection
            clearable
            options={this.filterOptions()}
            value={value}
            onChange={onChange}
          />
        : null
    )
  }
}