import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';

class Spinner extends Component {
  render() {
    return (
      <Loader active/>
    )
  };
}

export default Spinner;