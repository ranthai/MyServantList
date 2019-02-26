import { Image, Modal, Accordion } from 'semantic-ui-react';
import React, { Component } from 'react';
import Servant from '../../models/Servant';
import './ServantCard.css'

interface Props {
  servant: Servant;
}

class ServantCard extends Component<Props, {}> {

  public renderModalContent() {
    return (
      <Modal.Content image>
        <Image wrapped
          className='halfWidth'
          src={this.props.servant.stage_one_url}/>
        <Modal.Description>
          <Accordion styled
            exclusive={false}>
            <Accordion.Title>Ascension Material</Accordion.Title>
            <Accordion.Content>

            </Accordion.Content>
          </Accordion>
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
        src={this.props.servant.icon_url}>
        </Image>
    );
  }

  render() {
    return (
      <Modal
        size='large'
        trigger={this.renderServantTile()}>
        {this.renderModalHeader()}
        {this.renderModalContent()}
      </Modal>
    );
  }
}

export default ServantCard;