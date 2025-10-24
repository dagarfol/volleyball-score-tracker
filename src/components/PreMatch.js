import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PreMatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 8px;
  width: 100%;
`;

const Select = styled.select`
  margin: 10px 0;
  padding: 8px;
  width: 100%;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
`;

function PreMatch({ setMatchDetails, matchDetails }) {
  const [teamA, setTeamA] = useState(matchDetails.teams.teamA);
  const [teamB, setTeamB] = useState(matchDetails.teams.teamB);
  const [teamALogo, setTeamALogo] = useState(matchDetails.teamLogos.teamA);
  const [teamBLogo, setTeamBLogo] = useState(matchDetails.teamLogos.teamB);
  const [matchHeader, setMatchHeader] = useState(matchDetails.matchHeader);
  const [stadium, setStadium] = useState(matchDetails.stadium);
  const [extendedInfo, setExtendedInfo] = useState(matchDetails.extendedInfo);
  const [maxSets, setMaxSets] = useState(matchDetails.maxSets);
  const navigate = useNavigate();

  const handleStartMatch = () => {
    setMatchDetails({
      teams: { teamA, teamB },
      teamLogos: { teamA: teamALogo, teamB: teamBLogo },
      matchHeader,
      stadium,
      extendedInfo,
      maxSets,
    });
    navigate('/match');
  };

  return (
    <PreMatchContainer>
      <h1>Pre-Match Setup</h1>
      <Input
        type="text"
        placeholder="Match Header"
        value={matchHeader}
        onChange={(e) => setMatchHeader(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Team A Name"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Team A Logo URL"
        value={teamALogo}
        onChange={(e) => setTeamALogo(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Team B Name"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Team B Logo URL"
        value={teamBLogo}
        onChange={(e) => setTeamBLogo(e.target.value)}
      />
      <Select value={maxSets} onChange={(e) => setMaxSets(parseInt(e.target.value, 10))}>
        <option value={3}>3 Sets</option>
        <option value={5}>5 Sets</option>
      </Select>
      <Input
        type="text"
        placeholder="Stadium"
        value={stadium}
        onChange={(e) => setStadium(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Extended Info"
        value={extendedInfo}
        onChange={(e) => setExtendedInfo(e.target.value)}
      />
      <Button onClick={handleStartMatch}>Start Match</Button>
    </PreMatchContainer>
  );
}

export default PreMatch;
