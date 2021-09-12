import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import MatrixService from '/imports/ui/components/matrix/service';
import lockContextContainer from '/imports/ui/components/lock-viewers/context/container';
import UserMatrix from './component';

const UserMatrixContainer = (props) => <UserMatrix {...props} />;

export default lockContextContainer(withTracker(({ userLocks }) => {
  const shouldDisableMatrix = userLocks.userMatrix;
  return {
    isPanelOpened: MatrixService.isPanelOpened(),
    disableMatrix: shouldDisableMatrix,
  };
})(UserMatrixContainer));
