import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import Icon from '/imports/ui/components/icon/component';
import MatrixService from '/imports/ui/components/matrix/service';
import { styles } from '/imports/ui/components/user-list/user-list-content/styles';

const propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  isPanelOpened: PropTypes.bool.isRequired,
};

const intlMessages = defineMessages({
  title: {
    id: 'app.userList.matrixTitle',
    description: 'Title for the Matrix chat',
  },
  Matrix: {
    id: 'app.matrix.title',
    description: 'Title for the LPC 2021 chat',
  },
  unreadContent: {
    id: 'app.userList.MatrixListItem.unreadContent',
    description: 'Aria label for Matrix unread content',
  },
  locked: {
    id: 'app.matrix.locked',
    description: '',
  },
  byModerator: {
    id: 'app.userList.byModerator',
    description: '',
  },
});

class UserMatrix extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unread: false,
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    const { isPanelOpened, revs } = this.props;
    const { unread } = this.state;

    if (!isPanelOpened && !unread) {
      if (prevProps.revs !== revs) this.setUnread(true);
    }

    if (isPanelOpened && unread) {
      this.setUnread(false);
    }
  }

  setUnread(unread) {
    this.setState({ unread });
  }

  renderMatrix() {
    const { intl, disableMatrix } = this.props;
    const { unread } = this.state;

    let notification = null;
    if (unread) {
      notification = (
        <div
          className={styles.unreadMessages}
          aria-label={intl.formatMessage(intlMessages.unreadContent)}
        >
          <div className={styles.unreadMessagesText} aria-hidden="true">
            ···
          </div>
        </div>
      );
    }

    return (
      <div
        aria-label={intl.formatMessage(intlMessages.Matrix)}
        aria-describedby="lockedMatrix"
        role="button"
        tabIndex={0}
        className={styles.listItem}
        onClick={MatrixService.toggleMatrixPanel}
        onKeyPress={() => { }}
      >
        <Icon iconName="group_chat" />
        <div aria-hidden>
          <div className={styles.matrixTitle} data-test="Matrix">
            {intl.formatMessage(intlMessages.Matrix)}
          </div>
          {disableMatrix
            ? (
              <div className={styles.matrixLock}>
                <Icon iconName="lock" />
                <span id="lockedMatrix">{`${intl.formatMessage(intlMessages.locked)} ${intl.formatMessage(intlMessages.byModerator)}`}</span>
              </div>
            ) : null}
        </div>
        {notification}
      </div>
    );
  }

  render() {
    const { intl } = this.props;

    if (!MatrixService.isEnabled()) return null;

    return (
      <div className={styles.messages}>
        <div className={styles.container}>
          <h2 className={styles.smallTitle}>
            {intl.formatMessage(intlMessages.title)}
          </h2>
        </div>
        <div className={styles.scrollableList}>
          <div className={styles.list}>
            {this.renderMatrix()}
          </div>
        </div>
      </div>
    );
  }
}

UserMatrix.propTypes = propTypes;

export default UserMatrix;
