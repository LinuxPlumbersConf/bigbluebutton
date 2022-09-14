import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Matrix from './component';
import Service from './service';
import { layoutSelectInput, layoutDispatch } from '../layout/context';

const MatrixContainer = ({ ...props }) => {
  const cameraDock = layoutSelectInput((i) => i.cameraDock);
  const { isResizing } = cameraDock;
  const layoutContextDispatch = layoutDispatch();

  return <Matrix {...{ layoutContextDispatch, isResizing, ...props }} />;
};

export default withTracker(() => {
  const isLocked = Service.isLocked();
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

  return {
    isLocked,
    isRTL,
  };
})(MatrixContainer);
