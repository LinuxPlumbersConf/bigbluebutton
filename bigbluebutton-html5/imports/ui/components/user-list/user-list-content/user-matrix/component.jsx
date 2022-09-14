import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Icon from '/imports/ui/components/common/icon/component';
import Styled from './styles';
import { ACTIONS, PANELS } from '../../../layout/enums';

const intlMessages = defineMessages({
  title: {
    id: 'app.userList.matrixTitle',
    description: 'Title for the Matrix chat',
  },
  Matrix: {
    id: 'app.matrix.title',
    description: 'Title for the LPC 2022 chat',
  },
  locked: {
    id: 'app.matrix.locked',
    description: '',
  },
});

const UserMatrix = ({
  intl,
  disableMatrix,
  sidebarContentPanel,
  layoutContextDispatch,
}) => {
  if (disableMatrix) return null;

  const handleClickToggleMatrix = () => {
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
      value: sidebarContentPanel !== PANELS.MATRIX,
    });
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
      value: sidebarContentPanel === PANELS.MATRIX
        ? PANELS.NONE
        : PANELS.MATRIX,
    });
  };

  return (
    <Styled.Messages>
      <Styled.Container>
        <Styled.SmallTitle>
          {intl.formatMessage(intlMessages.title)}
        </Styled.SmallTitle>
      </Styled.Container>
      <Styled.List>
        <Styled.ScrollableList>
          <Styled.ListItem
            role="button"
            tabIndex={0}
            data-test="matrixMenuButton"
            onClick={handleClickToggleMatrix}
            onKeyPress={() => {}}
          >
            <Icon iconName="group_chat" />
            <span>{intl.formatMessage(intlMessages.Matrix)}</span>
          </Styled.ListItem>
        </Styled.ScrollableList>
      </Styled.List>
    </Styled.Messages>
  );
};

export default injectIntl(UserMatrix);

UserMatrix.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  disableMatrix: PropTypes.bool.isRequired,
  layoutContextDispatch: PropTypes.func.isRequired,
  sidebarContentPanel: PropTypes.string.isRequired,
};
