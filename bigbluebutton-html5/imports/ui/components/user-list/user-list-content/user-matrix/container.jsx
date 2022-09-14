import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import lockContextContainer from '/imports/ui/components/lock-viewers/context/container';
import UserMatrix from './component';
import { layoutSelectInput, layoutDispatch } from '../../../layout/context';

const UserMatrixContainer = (props) => {
  const sidebarContent = layoutSelectInput((i) => i.sidebarContent);
  const { sidebarContentPanel } = sidebarContent;
  const layoutContextDispatch = layoutDispatch();
  return <UserMatrix {...{ layoutContextDispatch, sidebarContentPanel, ...props }} />;
};

export default lockContextContainer(withTracker(({ userLocks }) => {
  const shouldDisableMatrix = userLocks.userMatrix;
  return {
    disableMatrix: shouldDisableMatrix,
  };
})(UserMatrixContainer));
