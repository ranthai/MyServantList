import { Image, Segment, Table, Label } from 'semantic-ui-react';
import React, { Component } from 'react';
import { ItemCount, SkillReinforcements } from '../../models/ServantData';
import './ServantCard.css'

interface Props {
  skill_reinforcements: SkillReinforcements;
}

export default class SkillReinforcementTable extends Component<Props, {}> {
  private renderSkillReinforcementTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Level</Table.HeaderCell>
          <Table.HeaderCell>Items</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderSkillReinforcementTableBody() {
    return (
      <Table.Body>
        {['2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map((level) => {
          return (
            <Table.Row key={level}>
              <Table.Cell>{level}</Table.Cell>
              <Table.Cell>
                <Segment.Group horizontal>
                  {this.props.skill_reinforcements[level].map((item_count) => {
                    return this.renderItemCount(item_count as ItemCount)
                  })}
                </Segment.Group>
              </Table.Cell>
            </Table.Row>)})}
      </Table.Body>
    )
  }

  private renderItemCount(item_count: ItemCount) {
    return (
      <Segment key={item_count.name}>
        <Label attached='bottom'>{item_count.name}</Label>
        <Image
          label={{floating: true, content: item_count.count}}
          src={item_count.url}/>
      </Segment>
    );
  }

  render() {
    return (
      <Table celled>
        {this.renderSkillReinforcementTableHeader()}
        {this.renderSkillReinforcementTableBody()}
      </Table>
    );
  }
}