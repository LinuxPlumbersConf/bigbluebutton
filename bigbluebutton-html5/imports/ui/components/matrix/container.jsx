import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Matrix from './component';
import MatrixService from './service';

class MatrixContainer extends PureComponent {
  render() {
    return (
      <Matrix {...this.props}>
        {/* {this.props.children} */}
      </Matrix>
    );
  }
}

export default withTracker(() => {
  const isLocked = MatrixService.isLocked();
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  return {
    isLocked,
    isRTL,
  };
})(MatrixContainer);
