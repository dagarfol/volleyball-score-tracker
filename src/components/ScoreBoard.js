import React, { useState } from 'react';
import styled from 'styled-components';

const ScoreBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const TeamInput = styled.input`
  margin: 5px;
  padding: 5px;
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
  text-align: center;
  background-color: #007BFF; /* Blue for Team A */
  color: white;
  padding: 10px;
  border-radius: 8px;
`;

const TeamScoreB = styled.div`
  flex: 1;
  text-align: center;
  background-color: #FF5733; /* Orange for Team B */
  color: white;
  padding: 10px;
  border-radius: 8px;
`;

const ScoreNumber = styled.p`
  font-size: 2em;
  margin: 0;
`;

const SetsWon = styled.p`
  font-size: 1em;
  margin: 0;
`;

function ScoreBoard({ teams, scores, setsWon, onStartMatch, onSetTeamNames }) {
  const [teamAName, setTeamAName] = useState('');
  const [teamBName, setTeamBName] = useState('');

  const handleSetNames = () => {
    onSetTeamNames(teamAName, teamBName);
  };

  return (
    <ScoreBoardContainer>
      <div>
        <TeamInput
          type="text"
          placeholder="Team A Name"
          value={teamAName}
          onChange={(e) => setTeamAName(e.target.value)}
        />
        <TeamInput
          type="text"
          placeholder="Team B Name"
          value={teamBName}
          onChange={(e) => setTeamBName(e.target.value)}
        />
        <TeamButton onClick={handleSetNames}>Set Team Names</TeamButton>
      </div>
      <div>
        <TeamButton onClick={() => onStartMatch('teamA')}>Team A Serves</TeamButton>
        <TeamButton onClick={() => onStartMatch('teamB')}>Team B Serves</TeamButton>
      </div>
      <ScoresContainer>
        <TeamScoreA>
          <h2>{teams.teamA}</h2>
          <ScoreNumber>{scores.teamA}</ScoreNumber>
          <SetsWon>Sets Won: {setsWon.teamA}</SetsWon>
        </TeamScoreA>
        <TeamScoreB>
          <h2>{teams.teamB}</h2>
          <ScoreNumber>{scores.teamB}</ScoreNumber>
          <SetsWon>Sets Won: {setsWon.teamB}</SetsWon>
        </TeamScoreB>
      </ScoresContainer>
    </ScoreBoardContainer>
  );
}

export default ScoreBoard;
