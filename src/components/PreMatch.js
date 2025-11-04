import React, { useState, useEffect } from 'react';
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

function PreMatch({ setMatchDetails, matchDetails, setActiveTab }) {
  const [teamA, setTeamA] = useState(matchDetails.teams.teamA);
  const [teamB, setTeamB] = useState(matchDetails.teams.teamB);
  const [teamALogo, setTeamALogo] = useState(matchDetails.teamLogos.teamA);
  const [teamBLogo, setTeamBLogo] = useState(matchDetails.teamLogos.teamB);
  const [matchHeader, setMatchHeader] = useState(matchDetails.matchHeader);
  const [stadium, setStadium] = useState(matchDetails.stadium);
  const [extendedInfo, setExtendedInfo] = useState(matchDetails.extendedInfo);
  const [maxSets, setMaxSets] = useState(matchDetails.maxSets);
  const [statsA, setStatsA] = useState(matchDetails.stats.teamA);
  const [statsB, setStatsB] = useState(matchDetails.stats.teamB);

  // Update match details state whenever any input loses focus or selection changes
  useEffect(() => {
    setMatchDetails({
      teams: { teamA, teamB },
      teamLogos: { teamA: teamALogo, teamB: teamBLogo },
      matchHeader,
      stadium,
      extendedInfo,
      maxSets,
      stats: {
        teamA: statsA,
        teamB: statsB,
      },
    });
  }, [teamA, teamB, teamALogo, teamBLogo, matchHeader, stadium, extendedInfo, maxSets, statsA, statsB, setMatchDetails]);

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
            onBlur={() => setMatchDetails(prevDetails => ({
              ...prevDetails,
              stats: {
                ...prevDetails.stats,
                [team === 'A' ? 'teamA' : 'teamB']: stats,
              },
            }))}
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
        onBlur={() => setMatchDetails(prevDetails => ({ ...prevDetails, matchHeader }))}
      />
      <Input
        type="text"
        placeholder="Extended Info"
        value={extendedInfo}
        onChange={(e) => setExtendedInfo(e.target.value)}
        onBlur={() => setMatchDetails(prevDetails => ({ ...prevDetails, extendedInfo }))}
      />
      <Input
        type="text"
        placeholder="Stadium"
        value={stadium}
        onChange={(e) => setStadium(e.target.value)}
        onBlur={() => setMatchDetails(prevDetails => ({ ...prevDetails, stadium }))}
      />
      <Input
        type="text"
        placeholder="Team A Name"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
        onBlur={() => setMatchDetails(prevDetails => ({
          ...prevDetails,
          teams: { ...prevDetails.teams, teamA },
        }))}
      />
      <Input
        type="text"
        placeholder="Team A Logo URL"
        value={teamALogo}
        onChange={(e) => setTeamALogo(e.target.value)}
        onBlur={() => setMatchDetails(prevDetails => ({
          ...prevDetails,
          teamLogos: { ...prevDetails.teamLogos, teamA: teamALogo },
        }))}
      />
      <Input
        type="text"
        placeholder="Team B Name"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
        onBlur={() => setMatchDetails(prevDetails => ({
          ...prevDetails,
          teams: { ...prevDetails.teams, teamB },
        }))}
      />
      <Input
        type="text"
        placeholder="Team B Logo URL"
        value={teamBLogo}
        onChange={(e) => setTeamBLogo(e.target.value)}
        onBlur={() => setMatchDetails(prevDetails => ({
          ...prevDetails,
          teamLogos: { ...prevDetails.teamLogos, teamB: teamBLogo },
        }))}
      />
      <h2>{teamA} Statistics (Team A)</h2>
      {renderStatInputs('A', statsA)}

      <h2>{teamB} Statistics (Team B)</h2>
      {renderStatInputs('B', statsB)}

      <Select
        value={maxSets}
        onChange={(e) => {
          const newMaxSets = parseInt(e.target.value, 10);
          setMaxSets(newMaxSets);
          setMatchDetails(prevDetails => ({ ...prevDetails, maxSets: newMaxSets }));
        }}
      >
        <option value={3}>3 Sets</option>
        <option value={5}>5 Sets</option>
      </Select>
    </PreMatchContainer>
  );
}

export default PreMatch;
