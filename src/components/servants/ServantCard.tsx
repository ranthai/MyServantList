import { Image, Segment, Header, Modal, Dropdown } from 'semantic-ui-react';
import React, { Component } from 'react';
import Servant from '../../models/Servant';
import AscensionTable from './AscensionTable';
import SkillReinforcementTable from './SkillReinforcementTable';
import './ServantCard.css';

interface Props {
  servant: Servant;
}

class ServantCard extends Component<Props, {}> {
  private options = [
    {
      text: 'None',
      value: 'None'
    },
    {
      text: 'Wished',
      value: 'Wished'
    },
    {
      text: 'Owned',
      value: 'Owned'
    }
  ]

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
      content: this.props.servant.ascensions ?
        <AscensionTable ascensions={this.props.servant.ascensions}/>
        : 'None'
    },
    {
      header: 'Skill Reinforcement',
      content: this.props.servant.skill_reinforcements ?
        <SkillReinforcementTable skill_reinforcements={this.props.servant.skill_reinforcements}/>
        : 'None'
    }
  ]

  private renderModalContent() {
    return (
      <Modal.Content>
        <Modal.Description>
          <Dropdown selection
            placeholder='Status'
            options={this.options}/>
          <Segment>
            <Image wrapped
              className='halfWidth'
              src={this.props.servant.stage_one_url}/>
          </Segment>
          {this.contents.map((content) => {
            return (
              <Segment>
                <Header>{content.header}</Header>
                {content.content}
              </Segment>)})}
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
      <Modal closeIcon
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