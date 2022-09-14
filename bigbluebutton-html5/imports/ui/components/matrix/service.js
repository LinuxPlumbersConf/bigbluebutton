import Users from '/imports/api/users';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import { isMatrixEnabled } from '/imports/ui/services/features';

const MATRIX_CONFIG = Meteor.settings.public.matrix;
const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

const isLocked = () => {
  const meeting = Meetings.findOne({ meetingId: Auth.meetingID }, { fields: { 'lockSettingsProps.disableMatrix': 1 } });
  const user = Users.findOne({ userId: Auth.userID }, { fields: { locked: 1, role: 1 } });

  if (meeting.lockSettingsProps && user.role !== ROLE_MODERATOR && user.locked) {
    return meeting.lockSettingsProps.disableMatrix;
  }
  return false;
};

const isEnabled = () => isMatrixEnabled();

const toggleMatrixPanel = (sidebarContentPanel, layoutContextDispatch) => {
  layoutContextDispatch({
    type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
    value: sidebarContentPanel !== PANELS.MATRIX,
  });
  layoutContextDispatch({
    type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
    value:
      sidebarContentPanel === PANELS.MATRIX
        ? PANELS.NONE
        : PANELS.MATRIX,
  });
};

export default {
  ID: MATRIX_CONFIG.id,
  toggleMatrixPanel,
  isLocked,
  isEnabled,
};
