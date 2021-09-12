import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { defineMessages, injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Button from '/imports/ui/components/button/component';
import MatrixService from './service';
import { styles } from './styles';
import Auth from '/imports/ui/services/auth';
import Meetings from '/imports/api/meetings';

const intlMessages = defineMessages({
  hideMatrixLabel: {
    id: 'app.matrix.hideMatrixLabel',
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
  // isLocked: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  isRTL: PropTypes.bool.isRequired,
};

class Matrix extends Component {
  constructor(props) {
    super(props);

    this.matrixURL = MatrixService.getMatrixURL();
  }

  componentWillUnmount() {
  //  const beingUnmounted = 'Discovering component calls';
  }

  render() {
    const {
      // isLocked,
      intl,
      isRTL,
    } = this.props;

    const prop = Meetings.findOne(
      { meetingId: Auth.meetingID },
      { fields: { metadataProp: 1 } },
    ).metadataProp;

    const matrixRoomID = prop.metadata ? prop.metadata.matrixroomid : null;

    const matrixtitle = `Matrix integration for ${Auth.confname}`;
    const matrixurl = `/riot-embedded/index.html?urlroomid=${matrixRoomID}&urluserid=${Auth.fullname}`;
    return (
      <div
        data-test="matrix"
        className={styles.matrix}
      >
        <header className={styles.header}>
          <div
            data-test="matrixTitle"
            className={styles.title}
          >
            <Button
              onClick={() => {
                Session.set('openPanel', 'userlist');
                window.dispatchEvent(new Event('panelChanged'));
              }}
              data-test="hideMatrixLabel"
              aria-label={intl.formatMessage(intlMessages.hideMatrixLabel)}
              label={intl.formatMessage(intlMessages.title)}
              icon={isRTL ? 'right_arrow' : 'left_arrow'}
              className={styles.hideBtn}
            />
          </div>
        </header>
        <iframe
          title={matrixtitle}
          src={matrixurl}
          aria-describedby="MatrixEscapeHint"
        />
        <span id="MatrixEscapeHint" className={styles.hint} aria-hidden>
          {intl.formatMessage(intlMessages.tipLabel)}
        </span>
      </div>
    );
  }
}

Matrix.propTypes = propTypes;

export default injectWbResizeEvent(injectIntl(Matrix));
