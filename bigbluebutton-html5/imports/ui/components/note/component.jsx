import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { defineMessages, injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Button from '/imports/ui/components/button/component';
import NoteService from './service';
import { styles } from './styles';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';

const intlMessages = defineMessages({
  hideNoteLabel: {
    id: 'app.note.hideNoteLabel',
    description: 'Label for hiding note button',
  },
  title: {
    id: 'app.note.title',
    description: 'Title for the shared notes',
  },
  tipLabel: {
    id: 'app.note.tipLabel',
    description: 'Label for tip on how to escape iframe',
  },
});

const propTypes = {
  // isLocked: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

class Note extends Component {
  constructor(props) {
    super(props);

    this.noteURL = NoteService.getNoteURL();
    this.readOnlyURL = NoteService.getReadOnlyURL();
  }

  componentWillUnmount() {
    const revs = NoteService.getRevs();
    NoteService.setLastRevs(revs);
  }

  render() {
    const {
      // isLocked,
      intl,
      isRTL,
    } = this.props;

    // const url = isLocked ? this.readOnlyURL : this.noteURL;
    const currentUser = Users.findOne({
      meetingId: Auth.meetingID,
      userId: Auth.userID,
    }, {
      fields: {
        name: 1,
      },
    });

    const matrixurl = `/riot-embedded/index.html?urluserid=${currentUser.name}`;
    return (
      <div
        data-test="note"
        className={styles.note}
      >
        <header className={styles.header}>
          <div
            data-test="noteTitle"
            className={styles.title}
          >
            <Button
              onClick={() => {
                Session.set('openPanel', 'userlist');
                window.dispatchEvent(new Event('panelChanged'));
              }}
              data-test="hideNoteLabel"
              aria-label={intl.formatMessage(intlMessages.hideNoteLabel)}
              label={intl.formatMessage(intlMessages.title)}
              icon={isRTL ? 'right_arrow' : 'left_arrow'}
              className={styles.hideBtn}
            />
          </div>
        </header>
        <iframe
          title="Test Matrix integration for LPC2021"
          src={matrixurl}
          aria-describedby="sharedNotesEscapeHint"
        />
        <span id="sharedNotesEscapeHint" className={styles.hint} aria-hidden>
          {intl.formatMessage(intlMessages.tipLabel)}
        </span>
      </div>
    );
  }
}

Note.propTypes = propTypes;

export default injectWbResizeEvent(injectIntl(Note));
