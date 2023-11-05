import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Styled from './styles';
import Auth from '/imports/ui/services/auth';
import getFromUserSettings from '/imports/ui/services/users-settings';
import Meetings from '/imports/api/meetings';
import { PANELS, ACTIONS } from '../layout/enums';
import Header from '/imports/ui/components/common/control-header/component';
import browserInfo from '/imports/utils/browserInfo';

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

const propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  isResizing: PropTypes.bool.isRequired,
  layoutContextDispatch: PropTypes.func.isRequired,
};

const Matrix = ({
  intl,
  layoutContextDispatch,
  isResizing,
  isVisible,
}) => {
  const { isChrome } = browserInfo;

  const prop = Meetings.findOne(
    { meetingId: Auth.meetingID },
    { fields: { metadataProp: 1 } },
  ).metadataProp;

  const matrixRoomID = prop.metadata ? prop.metadata.matrixroomid : null;
  const urlemail = getFromUserSettings('mail', 'failed-to-retrieve-mail');
  const urlregcode = getFromUserSettings('regcode', 'failed-to-retrieve-regcode');
  const matrixtitle = `Matrix integration for ${Auth.confname}`;
  const matrixurl = `/riot-embedded/index.html?urlroomid=${matrixRoomID}&urlemail=${urlemail}&urlregcode=${urlregcode}`;

  return (
    <Styled.Matrix
	data-test="matrix"
	isChrome={isChrome}
	style={ isVisible ? {} : {display: 'none'}}
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
          'data-test': 'hide',
          'aria-label': intl.formatMessage(intlMessages.hide),
          label: intl.formatMessage(intlMessages.title),
        }}
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

Matrix.propTypes = propTypes;

export default injectWbResizeEvent(injectIntl(Matrix));
