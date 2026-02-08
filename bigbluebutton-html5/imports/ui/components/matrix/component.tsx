import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from './styles';
import Header from '/imports/ui/components/common/control-header/component';
import browserInfo from '/imports/utils/browserInfo';
import { PANELS, ACTIONS } from '../layout/enums';
import { layoutSelectInput, layoutDispatch } from '../layout/context';
import { Input } from '../layout/layoutTypes';
import getFromUserSettings from '/imports/ui/services/users-settings';
import useMeeting from '/imports/ui/core/hooks/useMeeting';

const intlMessages = defineMessages({
  hide: {
    id: 'app.matrix.hide',
    description: 'Label for hiding matrix button',
  },
  title: {
    id: 'app.matrix.title',
    description: 'Title for Matrix',
  },
  tipLabel: {
    id: 'app.matrix.tipLabel',
    description: 'Label for tip on how to escape iframe',
  },
});

interface MatrixProps {
  isResizing: boolean;
  isVisible: boolean;
}

const Matrix: React.FC<MatrixProps> = ({
  isResizing,
  isVisible,
}) => {
  const intl = useIntl();
  const { isChrome } = browserInfo;
  const layoutContextDispatch = layoutDispatch();

  const { data: meetingData } = useMeeting((m) => ({
    name: m.name,
  }));

  // Get Matrix settings from user settings (passed via API as userdata-* parameters)
  const matrixRoomID = getFromUserSettings('matrixroomid', '');
  const urlemail = getFromUserSettings('mail', '');
  const urlregcode = getFromUserSettings('regcode', '');

  const matrixtitle = `Matrix integration for ${meetingData?.name || 'BigBlueButton'}`;
  const matrixurl = `/riot-embedded/index.html?urlroomid=${encodeURIComponent(matrixRoomID)}&urlemail=${encodeURIComponent(urlemail)}&urlregcode=${encodeURIComponent(urlregcode)}`;

  // Don't render the iframe content if Matrix is not configured
  if (!matrixRoomID) {
    return null;
  }

  return (
    <Styled.Matrix
      data-test="matrix"
      isChrome={isChrome}
      style={isVisible ? {} : { display: 'none' }}
    >
      <Header
        leftButtonProps={{
          onClick: () => {
            layoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
              value: false,
            });
            layoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
              value: PANELS.NONE,
            });
          },
          'data-test': 'hideMatrixLabel',
          'aria-label': intl.formatMessage(intlMessages.hide),
          label: intl.formatMessage(intlMessages.title),
        }}
        customRightButton={null}
        rightButtonProps={null}
      />
      <Styled.IFrame
        title={matrixtitle}
        src={matrixurl}
        aria-describedby="MatrixEscapeHint"
        style={{
          pointerEvents: isResizing ? 'none' : 'inherit',
        }}
      />
      <Styled.Hint
        id="MatrixEscapeHint"
        aria-hidden
      >
        {intl.formatMessage(intlMessages.tipLabel)}
      </Styled.Hint>
    </Styled.Matrix>
  );
};

const MatrixContainer: React.FC<{ isVisible?: boolean }> = ({ isVisible = true }) => {
  const sidebarContent = layoutSelectInput((i: Input) => i.sidebarContent);
  const cameraDock = layoutSelectInput((i: Input) => i.cameraDock);
  const { isResizing } = cameraDock;

  // Always render but hide when not visible (for persistent iframe)
  const shouldShow = isVisible || sidebarContent.sidebarContentPanel === PANELS.MATRIX;

  return (
    <Matrix
      isResizing={isResizing}
      isVisible={shouldShow}
    />
  );
};

export default MatrixContainer;
