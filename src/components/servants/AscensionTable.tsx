import { Image, Segment, Table, Label } from 'semantic-ui-react';
import React, { Component } from 'react';
import { isItemCount, Requirement, ItemCount, Condition, Ascensions } from '../../models/Servant';
import './ServantCard.css'

interface Props {
  ascensions: Ascensions;
}

export default class AscensionTable extends Component<Props, {}> {
  private renderAscensionTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Ascension</Table.HeaderCell>
          <Table.HeaderCell>Requirement</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderAscensionTableBody() {
    return (
      <Table.Body>
        {['1st', '2nd', '3rd', '4th'].map((level) => {
          return (
            <Table.Row>
              <Table.Cell>{level}</Table.Cell>
              <Table.Cell>
                <Segment.Group horizontal>
                  {this.props.ascensions[level].map((requirement) => {
                    return this.renderRequirement(requirement)
                  })}
                </Segment.Group>
              </Table.Cell>
            </Table.Row>)})}
      </Table.Body>
    )
  }

  private renderRequirement(requirement: Requirement) {
    return (
      isItemCount(requirement) ?
        this.renderItemCount(requirement as ItemCount) :
        this.renderCondition(requirement as Condition)
    );
  }

  private renderItemCount(requirement: ItemCount) {
    return (
      <Segment>
        <Label attached='bottom'>{requirement.name}</Label>
        <Image centered
          label={{floating: true, content: requirement.count}}
          src={requirement.url}/>
      </Segment>
    );
  }

  private renderCondition(requirement: Condition) {
    return (
      <Segment>
        {(requirement as Condition).condition}
      </Segment>
    );
  }

  render() {
    return (
      <Table celled>
        {this.renderAscensionTableHeader()}
        {this.renderAscensionTableBody()}
      </Table>
    );
  }
}