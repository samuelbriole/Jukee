import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, branch, renderNothing } from 'recompose';
import styled from 'styled-components';

import { playerExists } from 'selectors/player';
import { togglePause } from 'actions/player';
import Player from './player';
import PlayerControls from './controls';
import CurrentTrack from './currentTrack';

const BottomPlayerBarContainer1 = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #282828;
`;

const BottomPlayerBarContainer2 = styled.footer`
  min-width: 620px;
  background-color: #282828;
  border-top: 1px solid #000;
  display: flex;
  flex-direction: column;
  height: auto;
  user-select: none;
`;

const BottomPlayerBarContainer3 = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 90px;
  padding: 0 16px;
`;

const PlayerBarLeft = styled.div`
  width: 30%;
  min-width: 180px;
`;

const PlayerBarMiddle = styled.div`
  width: 40%;
  max-width: 722px;
`;

const PlayerBarRight = styled.div`
  width: 30%;
  min-width: 180px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

class PlayerBar extends Component {
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    // check that space has been pressed, not on an input or textarea
    const tag = event.target.tagName.toLowerCase();
    if (event.keyCode === 32 && tag !== 'input' && tag !== 'textarea') {
      event.preventDefault();
      this.props.togglePause();
    }
  }

  render() {
    return (
      <BottomPlayerBarContainer1>
        <Player />
        <BottomPlayerBarContainer2>
          <BottomPlayerBarContainer3>
            <PlayerBarLeft>
              <CurrentTrack />
            </PlayerBarLeft>
            <PlayerBarMiddle>
              <PlayerControls />
            </PlayerBarMiddle>
            <PlayerBarRight />
          </BottomPlayerBarContainer3>
        </BottomPlayerBarContainer2>
      </BottomPlayerBarContainer1>
    );
  }
}

PlayerBar.propTypes = {
  togglePause: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  shouldHide: !playerExists(state),
});

const mapDispatchToProps = {
  togglePause,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  branch(({ shouldHide }) => shouldHide, renderNothing),
)(PlayerBar);