import { Image, Segment, Header, Modal, Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import React, { Component, SyntheticEvent } from 'react';
import Servant, { Category } from '../../models/Servant';
import AscensionTable from './AscensionTable';
import SkillReinforcementTable from './SkillReinforcementTable';
import './ServantCard.css';

interface Props {
  servant: Servant;
}

interface State {
  status: CollectionStatus;
}

enum CollectionStatus {
  None = 'None',
  Unwanted = 'Unwanted',
  Wished = 'Wished',
  Owned = 'Owned'
}

export default class ServantCard extends Component<Props, State> {
  state = {
    status: CollectionStatus.None
  }

  private getCollectionStatus() {
    var collection_servants_string = window.localStorage.getItem('COLLECTION_SERVANTS');
    if (collection_servants_string === null) return CollectionStatus.None

    var collection_servants = JSON.parse(collection_servants_string);
    var id = this.props.servant.id;
    return collection_servants[id];
  }

  private defaultStatus() {
    this.setState ({
      status: this.getCollectionStatus()
    })
  }

  componentDidMount() {
    this.defaultStatus()
  }

  private options = [
    {
      text: 'None',
      value: 'None'
    },
    {
      text: 'Unwanted',
      value: 'Unwanted'
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

  setStatus = (event: SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    var value = (data.value as CollectionStatus)

    this.setState({
      status: value
    })

    var collection_servants_string = window.localStorage.getItem('COLLECTION_SERVANTS');
    var collection_servants = collection_servants_string ? JSON.parse(collection_servants_string) : [];
    var id = this.props.servant.id;
    collection_servants[id] = value;
    window.localStorage.setItem('COLLECTION_SERVANTS', JSON.stringify(collection_servants))
  }

  private renderModalContent() {
    return (
      <Modal.Content>
        <Modal.Description>
          {this.props.servant.category !== Category.EnemyServants ?
            <Dropdown selection
              value={this.state.status}
              onChange={this.setStatus}
              placeholder='Status'
              options={this.options}/>
              : null}
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

  private statusToLabelColor() {
    switch(this.state.status) {
      case CollectionStatus.Unwanted:
        return 'red';
      case CollectionStatus.Wished:
        return 'green';
      case CollectionStatus.Owned:
        return 'blue';
      default:
        return null;
    }
  }

  private renderServantTile() {
    return (
      <Image
        className='hover'
        as='a'
        label={{attached: 'bottom', color: this.statusToLabelColor(), content: this.props.servant.english_name}}
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