import { Image, Label, Modal, Dropdown, Accordion } from 'semantic-ui-react';
import React, { Component } from 'react';
import Servant from '../../models/Servant';
import './ServantCard.css'
import { all } from 'q';

interface Props {
  servant: Servant;
}

const options = [
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

const panels = [
  {
    key: 'passive-skills',
    title: 'Passive Skills',
    content: 'Under Construction'
  },
  {
    key: 'active-skills',
    title: 'Active Skills',
    content: 'Under Construction'
  },
  {
    key: 'noble-phantasm',
    title: 'Noble Phantasm',
    content: 'Under Construction'
  },
  {
    key: 'ascension',
    title: 'Ascension',
    content: 'Under Construction'
  }
]

class ServantCard extends Component<Props, {}> {

  public renderModalContent() {
    return (
      <Modal.Content image>
        <Image wrapped
          className='halfWidth'
          src={this.props.servant.stage_one_url}/>
        <Modal.Description>
          {/* <Dropdown fluid selection
            placeholder='Status'
            options={options}/> */}
          <Accordion styled
            defaultActiveIndex={[0, 1, 2, 3]}
            panels={panels}
            exclusive={false}/>
        </Modal.Description>
      </Modal.Content>
    );
  }

  public renderModalHeader() {
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

  public renderServantTile() {
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
      <Modal scrolling
        size='large'
        trigger={this.renderServantTile()}>
        {this.renderModalHeader()}
        {this.renderModalContent()}
      </Modal>
    );
  }
}

export default ServantCard;