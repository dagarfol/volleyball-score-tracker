import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CustomCombobox from './CustomCombobox';

const PreMatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const ImageSelector = styled.div`
  display: flex;
  width: 100%;
  gap: 5px;
`;

const ImagePreview = styled.img`
  width: 100px;
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

const StatInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  margin-top: 15px;
`;

const StatInput = styled.input`
  padding: 8px;
  width: 100%;
`;

function PreMatch({ setMatchDetails, matchDetails, socket }) {
  const [teamA, setTeamA] = useState(matchDetails.teams.teamA);
  const [teamB, setTeamB] = useState(matchDetails.teams.teamB);
  const [teamALogo, setTeamALogo] = useState(matchDetails.teamLogos.teamA);
  const [teamBLogo, setTeamBLogo] = useState(matchDetails.teamLogos.teamB);
  const [matchHeader, setMatchHeader] = useState(matchDetails.matchHeader);
  const [stadium, setStadium] = useState(matchDetails.stadium);
  const [extendedInfo, setExtendedInfo] = useState(matchDetails.extendedInfo);
  const [competitionLogo, setCompetitionLogo] = useState(matchDetails.competitionLogo);
  const [maxSets, setMaxSets] = useState(matchDetails.maxSets);
  const [statsA, setStatsA] = useState(matchDetails.stats.teamA);
  const [statsB, setStatsB] = useState(matchDetails.stats.teamB);

  // Update match details state whenever any input loses focus or selection changes
  useEffect(() => {
    const updatedMatchDetails = {
      teams: { teamA, teamB },
      teamLogos: { teamA: teamALogo, teamB: teamBLogo },
      matchHeader,
      stadium,
      extendedInfo,
      competitionLogo,
      maxSets,
      stats: {
        teamA: statsA,
        teamB: statsB,
      },
    };

    setMatchDetails(updatedMatchDetails);

    // Emit the updated match details to the server via the socket
    if (socket) {
      socket.emit('matchDetails', updatedMatchDetails);
    }
  }, [teamA, teamB, teamALogo, teamBLogo, matchHeader, stadium, extendedInfo, competitionLogo, maxSets, statsA, statsB, setMatchDetails, socket]);

  const handleStatChange = (team, stat, value) => {
    const intValue = parseInt(value, 10);
    if (team === 'A') {
      setStatsA(prevStats => ({
        ...prevStats,
        [stat]: isNaN(intValue) ? 0 : intValue,
      }));
    } else {
      setStatsB(prevStats => ({
        ...prevStats,
        [stat]: isNaN(intValue) ? 0 : intValue,
      }));
    }
  };

  const statFields = [
    { label: 'Ranking', key: 'ranking' },
    { label: 'Matches Played', key: 'matchesPlayed' },
    { label: 'Total Matches Won', key: 'totalMatchesWon' },
    { label: 'Won 3 Points', key: 'won3Points' },
    { label: 'Won 2 Points', key: 'won2Points' },
    { label: 'Total Matches Lost', key: 'totalMatchesLost' },
    { label: 'Lost 1 Point', key: 'lost1Point' },
    { label: 'Lost 0 Points', key: 'lost0Points' },
    { label: 'Total Points Scored', key: 'totalPointsScored' },
    { label: 'Total Points Received', key: 'totalPointsReceived' },
  ];

  const renderStatInputs = (team, stats) => (
    <StatInputs>
      {statFields.map(field => (
        <React.Fragment key={field.key}>
          <label>{field.label}</label>
          <StatInput
            type="number"
            value={stats[field.key]}
            onChange={(e) => handleStatChange(team, field.key, e.target.value)}
          />
        </React.Fragment>
      ))}
    </StatInputs>
  );

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
        placeholder="Extended Info"
        value={extendedInfo}
        onChange={(e) => setExtendedInfo(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Stadium"
        value={stadium}
        onChange={(e) => setStadium(e.target.value)}
      />
      <Select
        value={maxSets}
        onChange={(e) => {
          const newMaxSets = parseInt(e.target.value, 10);
          setMaxSets(newMaxSets);
        }}
      >
        <option value={3}>3 Sets</option>
        <option value={5}>5 Sets</option>
      </Select>
      <ImageSelector>
        <Input
          type="text"
          placeholder="Competition logo"
          value={competitionLogo}
          onChange={(e) => setCompetitionLogo(e.target.value)}
        />
        <ImagePreview src={competitionLogo}></ImagePreview>
      </ImageSelector>
      <Input
        type="text"
        placeholder="Team A Name"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
      />
      <CustomCombobox placeholderText={"Team A Logo URL"} inputValue={teamALogo} onInputChange={setTeamALogo} />
      <Input
        type="text"
        placeholder="Team B Name"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
      />
      <CustomCombobox placeholderText={"Team B Logo URL"} inputValue={teamBLogo} onInputChange={setTeamBLogo} />
      <h2>{teamA} Statistics (Team A)</h2>
      {renderStatInputs('A', statsA)}

      <h2>{teamB} Statistics (Team B)</h2>
      {renderStatInputs('B', statsB)}


    </PreMatchContainer>
  );
}

export default PreMatch;
