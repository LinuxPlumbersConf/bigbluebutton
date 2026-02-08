import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Icon from '/imports/ui/components/common/icon/component';
import { PANELS, ACTIONS } from '/imports/ui/components/layout/enums';
import { layoutSelectInput, layoutDispatch } from '/imports/ui/components/layout/context';
import Styled from './styles';
import { useIsMatrixEnabled } from '/imports/ui/services/features';
import getFromUserSettings from '/imports/ui/services/users-settings';

const intlMessages = defineMessages({
  title: {
    id: 'app.userList.matrixTitle',
    description: 'Title for the Matrix chat list',
  },
  matrix: {
    id: 'app.matrix.title',
    description: 'Title for the Matrix chat',
  },
  locked: {
    id: 'app.matrix.locked',
    description: 'Label for locked Matrix chat',
  },
});

interface UserMatrixGraphqlProps {
  disableMatrix: boolean;
  sidebarContentPanel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layoutContextDispatch: any;
  isEnabled: boolean;
  hasMatrixRoomId: boolean;
}

const UserMatrixGraphql: React.FC<UserMatrixGraphqlProps> = (props) => {
  const {
    disableMatrix,
    sidebarContentPanel,
    layoutContextDispatch,
    isEnabled,
    hasMatrixRoomId,
  } = props;
  const intl = useIntl();

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

  const renderMatrix = () => {
    const matrixOpen = sidebarContentPanel === PANELS.MATRIX;

    return (
      // @ts-ignore
      <Styled.ListItem
        aria-label={intl.formatMessage(intlMessages.matrix)}
        role="button"
        tabIndex={0}
        active={matrixOpen}
        aria-expanded={matrixOpen}
        data-test="matrixMenuButton"
        onClick={handleClickToggleMatrix}
        // @ts-ignore
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            handleClickToggleMatrix();
          }
        }}
        disabled={disableMatrix}
        $disabled={disableMatrix}
      >
        {/* @ts-ignore */}
        <Icon iconName="group_chat" />
        <div aria-hidden>
          <Styled.MatrixTitle data-test="matrixChatButton">
            {intl.formatMessage(intlMessages.matrix)}
          </Styled.MatrixTitle>
          {disableMatrix && (
            <Styled.MatrixLock>
              <span>
                {/* @ts-ignore */}
                <Icon iconName="lock" />
                &nbsp;
                {intl.formatMessage(intlMessages.locked)}
              </span>
            </Styled.MatrixLock>
          )}
        </div>
      </Styled.ListItem>
    );
  };

  // Don't render if Matrix is not enabled or no room ID is configured
  if (!isEnabled || !hasMatrixRoomId) return null;

  return (
    <Styled.Messages>
      <Styled.Container>
        <Styled.SmallTitle data-test="matrixTitle">
          {intl.formatMessage(intlMessages.title)}
        </Styled.SmallTitle>
      </Styled.Container>
      <Styled.ScrollableList>
        <Styled.List>
          {renderMatrix()}
        </Styled.List>
      </Styled.ScrollableList>
    </Styled.Messages>
  );
};

const UserMatrixContainer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sidebarContent = layoutSelectInput((i: any) => i.sidebarContent);
  const { sidebarContentPanel } = sidebarContent;
  const layoutContextDispatch = layoutDispatch();
  const isEnabled = useIsMatrixEnabled();

  // Check if Matrix room ID is configured via user settings
  const matrixRoomId = getFromUserSettings('matrixroomid', '');
  const hasMatrixRoomId = !!matrixRoomId;

  // For now, Matrix is not lockable - can be added later if needed
  const disableMatrix = false;

  return (
    <UserMatrixGraphql
      disableMatrix={disableMatrix}
      sidebarContentPanel={sidebarContentPanel}
      layoutContextDispatch={layoutContextDispatch}
      isEnabled={isEnabled}
      hasMatrixRoomId={hasMatrixRoomId}
    />
  );
};

export default UserMatrixContainer;
