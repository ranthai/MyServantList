import { Image, Segment, Header, Table, Modal, Dropdown, Container, Label, SegmentGroup } from 'semantic-ui-react';
import React, { Component } from 'react';
import Servant, { isItemCount, Requirement, ItemCount, Condition } from '../../models/Servant';
import './ServantCard.css'

interface Props {
  servant: Servant;
}

class ServantCard extends Component<Props, {}> {
  // private options = [
  //   {
  //     text: 'None',
  //     value: 'None'
  //   },
  //   {
  //     text: 'Wished',
  //     value: 'Wished'
  //   },
  //   {
  //     text: 'Owned',
  //     value: 'Owned'
  //   }
  // ]

  private contents = [
    {
      header: 'Passive Skills',
      content: 'Under Construction'
    },
    {
      header: 'Active Skills',
      content: 'Under Construction'
    },
    {
      header: 'Noble Phantasm',
      content: 'Under Construction'
    },
    {
      header: 'Ascension',
      content: this.renderAscensionTable()
    },
    {
      header: 'Skill Reinforcement',
      content: 'Under Construction'
    }
  ]

  private renderAscensionTable() {
    return this.props.servant.ascensions ? (
      <Table celled>
        {this.renderAscensionTableHeader()}
        <Table.Body>
          {['1st', '2nd', '3rd', '4th'].map((level) => {
            return (
              <Table.Row>
                <Table.Cell>{level}</Table.Cell>
                <Table.Cell>
                  <Segment.Group horizontal>
                    {this.props.servant.ascensions![level].map((requirement) => {
                      return this.renderRequirement(requirement)
                    })}
                  </Segment.Group>
                </Table.Cell>
              </Table.Row>)})}
        </Table.Body>
      </Table>
    ) : null;
  }

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
        <Image
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

  private renderModalContent() {
    return (
      <Modal.Content image>
        <Image wrapped
          className='halfWidth'
          src={this.props.servant.stage_one_url}/>
        <Modal.Description>
          {/* <Dropdown fluid selection
            placeholder='Status'
            options={this.options}/> */}
          {this.contents.map((content) => {
            return (
              <Container>
                <Segment>
                  <Header>{content.header}</Header>
                  {content.content}
                </Segment>
              </Container>)})}
        </Modal.Description>
      </Modal.Content>
    );
  }

  private renderModalHeader() {
    return (
      <Modal.Header>
        <Image
          floated='left'
          src={this.props.servant.class_url}/>
        <Image
          size='tiny'
          floated='right'
          src={this.props.servant.icon_url}/>
        <p>{this.props.servant.english_name}</p>
        <p>{this.props.servant.japanese_name}</p>
      </Modal.Header>
    );
  }

  private renderServantTile() {
    return (
      <Image
        className='hover'
        as='a'
        label={{attached: 'bottom', content: this.props.servant.english_name}}
        src={this.props.servant.icon_url}/>
    );
  }

  render() {
    return (
      <Modal
        scrolling='true'
        size='large'
        trigger={this.renderServantTile()}>
        {this.renderModalHeader()}
        {this.renderModalContent()}
      </Modal>
    );
  }
}

export default ServantCard;