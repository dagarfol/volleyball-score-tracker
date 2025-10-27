import React from 'react';
import styled from 'styled-components';

const ScoreBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const TeamButton = styled.button`
  margin: 5px;
`;

const ScoresContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const TeamScoreA = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #007BFF; /* Blue for Team A */
  color: white;
  padding: 10px;
  border-radius: 8px;
  position: relative;
  border: ${({ isPossession }) => (isPossession ? '3px solid #32CD32' : 'none')}; /* Green border for possession */
`;

const TeamScoreB = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FF5733; /* Orange for Team B */
  color: white;
  padding: 10px;
  border-radius: 8px;
  position: relative;
  border: ${({ isPossession }) => (isPossession ? '3px solid #32CD32' : 'none')}; /* Green border for possession */
`;

const ScoreNumberContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScoreNumber = styled.p`
  font-size: 2em;
  margin: 0 10px;
`;

const SetsWon = styled.p`
  font-size: 1em;
  margin: 0;
`;

const ServingIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 15px;
  height: 15px;
  background-color: #FFD700; /* Gold for serving */
  border-radius: 50%;
`;

const TeamLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 5px;
`;

const ScoreAdjustContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScoreAdjustButton = styled.button`
  margin: 5px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
`;

function ScoreBoard({ teams, teamLogos, scores, setsWon, currentServer, ballPossession, onStartMatch, matchStarted, onAdjustScore }) {
  return (
    <ScoreBoardContainer>
      <div>
        <TeamButton onClick={() => onStartMatch('teamA')} disabled={matchStarted}>Team A Serves</TeamButton>
        <TeamButton onClick={() => onStartMatch('teamB')} disabled={matchStarted}>Team B Serves</TeamButton>
      </div>
      <ScoresContainer>
        <TeamScoreA isPossession={ballPossession === 'teamA'}>
          <div>
            <TeamLogo src={teamLogos.teamA} alt={`${teams.teamA} logo`} />
            <h2>{teams.teamA}</h2>
          </div>
          <ScoreNumberContainer>
            <ScoreAdjustContainer>
              <ScoreAdjustButton onClick={() => onAdjustScore('teamA', 1)}>+</ScoreAdjustButton>
              <ScoreAdjustButton onClick={() => onAdjustScore('teamA', -1)}>-</ScoreAdjustButton>
            </ScoreAdjustContainer>
            <ScoreNumber>{scores.teamA}</ScoreNumber>
          </ScoreNumberContainer>
          <SetsWon>Sets Won: {setsWon.teamA}</SetsWon>
          {currentServer === 'teamA' && <ServingIndicator />}
        </TeamScoreA>
        <TeamScoreB isPossession={ballPossession === 'teamB'}>
          <div>
            <TeamLogo src={teamLogos.teamB} alt={`${teams.teamB} logo`} />
            <h2>{teams.teamB}</h2>
          </div>
          <ScoreNumberContainer>
            <ScoreNumber>{scores.teamB}</ScoreNumber>
            <ScoreAdjustContainer>
              <ScoreAdjustButton onClick={() => onAdjustScore('teamB', 1)}>+</ScoreAdjustButton>
              <ScoreAdjustButton onClick={() => onAdjustScore('teamB', -1)}>-</ScoreAdjustButton>
            </ScoreAdjustContainer>
          </ScoreNumberContainer>
          <SetsWon>Sets Won: {setsWon.teamB}</SetsWon>
          {currentServer === 'teamB' && <ServingIndicator />}
        </TeamScoreB>
      </ScoresContainer>
    </ScoreBoardContainer>
  );
}

export default ScoreBoard;
