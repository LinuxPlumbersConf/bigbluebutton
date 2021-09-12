import Users from '/imports/api/users';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import { Session } from 'meteor/session';

const MATRIX_CONFIG = Meteor.settings.public.matrix;
const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

const getMatrixRoomID = () => {
  const prop = Meetings.findOne({ meetingId: Auth.meetingID },
    { fields: { metadataProp: 1 } }).metadataProp;
  const matrixRoomID = prop.metadata ? prop.metadata.matrixroomid : null;

  return matrixRoomID;
};

/* const getMatrixParams = () => {
  const config = {};
  const User = Users.findOne({ userId: Auth.userID }, { fields: { name: 1 } });
  config.userName = User.name;
  config.lang = getLang();
  config.rtl = document.documentElement.getAttribute('dir') === 'rtl';

  const params = [];
  Object.keys(config).forEach((k) => {
    params.push(`${k}=${encodeURIComponent(config[k])}`);
  });

  return params.join('&');
}; */

const isLocked = () => {
  const meeting = Meetings.findOne({ meetingId: Auth.meetingID }, { fields: { 'lockSettingsProps.disableMatrix': 1 } });
  const user = Users.findOne({ userId: Auth.userID }, { fields: { locked: 1, role: 1 } });

  if (meeting.lockSettingsProps && user.role !== ROLE_MODERATOR && user.locked) {
    return meeting.lockSettingsProps.disableMatrix;
  }
  return false;
};

const getMatrixURL = () => {
  const matrixRoomID = getMatrixRoomID();
  // const params = getMatrixParams();
  const url = `/riot-embedded/index.html?urlroomid=${matrixRoomID}&urluserid=${Auth.fullname}`;
  return url;
};

const isPanelOpened = () => Session.get('openPanel') === 'matrix';

// const hasUnreadNotes = () => {
//   const opened = isPanelOpened();
//   if (opened) return false;

//   const revs = getRevs();
//   const lastRevs = getLastRevs();

//   return (revs !== 0 && revs > lastRevs);
// };

const isEnabled = () => MATRIX_CONFIG.enabled;

const toggleMatrixPanel = () => {
  Session.set(
    'openPanel',
    isPanelOpened() ? 'userlist' : 'matrix',
  );
  window.dispatchEvent(new Event('panelChanged'));
};

export default {
  getMatrixURL,
  toggleMatrixPanel,
  isLocked,
  isEnabled,
  isPanelOpened,
};
