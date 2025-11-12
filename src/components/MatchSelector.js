import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MatchSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Select = styled.select`
  margin: 10px 0;
  padding: 8px;
  width: 100%;
`;

const MatchSelector = ({ onSelectMatch }) => {
    const [competitionTypes, setCompetitionTypes] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [phases, setPhases] = useState([]);
    const [groups, setGroups] = useState([]);
    const [matches, setMatches] = useState([]);
    const [rankingData, setRankingData] = useState([]);

    const [selectedCompetitionType, setSelectedCompetitionType] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPhase, setSelectedPhase] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [journeyData, setJourneyData] = useState(null);

    useEffect(() => {
        const fetchCompetitionTypes = async () => {
            try {
                const response = await fetch('https://intranet.fmvoley.com/api/competiciones/getTiposCompeticion');
                const data = await response.json();
                setCompetitionTypes(data.content);
            } catch (error) {
                console.error('Error fetching competition types:', error);
            }
        };

        fetchCompetitionTypes();
    }, []);

    useEffect(() => {
        if (selectedCompetitionType) {
            const fetchCompetitions = async () => {
                try {
                    const response = await fetch(`https://intranet.fmvoley.com/api/competiciones/getCompeticiones?tipoCompeticionId=${selectedCompetitionType}`);
                    const data = await response.json();
                    setCompetitions(data.content);
                } catch (error) {
                    console.error('Error fetching competitions:', error);
                }
            };

            fetchCompetitions();
        }
    }, [selectedCompetitionType]);

    useEffect(() => {
        if (selectedCompetition) {
            const fetchCategories = async () => {
                try {
                    const response = await fetch(`https://intranet.fmvoley.com/api/competiciones/getCompeticionesTemporada?competicionId=${selectedCompetition}`);
                    const data = await response.json();
                    setCategories(data.content);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };

            fetchCategories();
        }
    }, [selectedCompetition]);

    useEffect(() => {
        if (selectedCategory) {
            const fetchPhases = async () => {
                try {
                    const response = await fetch(`https://intranet.fmvoley.com/api/competiciones/getFasesCompeticion?competicionTemporadaId=${selectedCategory}`);
                    const data = await response.json();
                    setPhases(data.content);
                } catch (error) {
                    console.error('Error fetching phases:', error);
                }
            };

            fetchPhases();
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedPhase) {
            const fetchGroups = async () => {
                try {
                    const response = await fetch(`https://intranet.fmvoley.com/api/competiciones/getGruposCompeticion?faseId=${selectedPhase}`);
                    const data = await response.json();
                    setGroups(data.content);
                } catch (error) {
                    console.error('Error fetching groups:', error);
                }
            };

            fetchGroups();
        }
    }, [selectedPhase]);

    useEffect(() => {
        if (selectedGroup) {
            const fetchGroupData = async () => {
                try {
                    const journeyResponse = await fetch(`https://intranet.fmvoley.com/api/competiciones/getJornadaActualGrupo?grupoId=${selectedGroup}`);
                    const journeyData = await journeyResponse.json();
                    setJourneyData(journeyData.content);
                    const journeyId = journeyData.content.id;

                    const matchesResponse = await fetch(`https://intranet.fmvoley.com/api/competiciones/getPartidosByJornada?jornadaId=${journeyId}`);
                    const matchesData = await matchesResponse.json();
                    setMatches(matchesData.content);

                    const rankingResponse = await fetch(`https://intranet.fmvoley.com/api/competiciones/getClasificacionGrupo?grupoId=${selectedGroup}`);
                    const rankingData = await rankingResponse.json();
                    setRankingData(rankingData.content);
                } catch (error) {
                    console.error('Error fetching group data:', error);
                }
            };

            fetchGroupData();
        }
    }, [selectedGroup]);

    const mapTeamDataToStats = (teamData) => ({
        ranking: teamData.posicion,
        competitionPoints: teamData.puntos,
        matchesPlayed: teamData.jugados,
        totalMatchesWon: teamData.ganados,
        won3Points: teamData.ganados3,
        won2Points: teamData.ganados2,
        totalMatchesLost: teamData.perdidos,
        lost1Point: teamData.perdidos1,
        lost0Points: teamData.perdidos0,
        totalPointsScored: teamData.puntos_a_favor,
        totalPointsReceived: teamData.puntos_en_contra,
    });

    const handleMatchSelect = (selectedMatch) => {
        const teamAData = rankingData.find(team => team.club_Id === selectedMatch.clubLocalId);
        const teamBData = rankingData.find(team => team.club_Id === selectedMatch.clubVisitanteId);
        const competition = competitions.find(type => type.id === selectedCompetition);
        const category = categories.find(type => type.id === selectedCategory);
        const phase = phases.find(comp => comp.id === selectedPhase);

        const matchDetails = {
            teamA: teamAData.nombre,
            teamB: teamBData.nombre,
            teamALogo: teamAData.imagen,
            teamBLogo: teamBData.imagen,
            matchHeader: `${competition.categoria_sexo} - ${category.nombre}`,
            extendedInfo: `Fase ${phase.nombre} - Jornada ${journeyData.numero}`,
            stadium: ` Pabellón ${selectedMatch.pabellon}`,
            //   competitionLogo: match.competitionLogo,
            maxSets: 5,
            stats: {
                teamA: mapTeamDataToStats(teamAData),
                teamB: mapTeamDataToStats(teamBData),
            },
        };

        onSelectMatch(matchDetails);

    };

    const handleMatchDropdownChange = (e) => {
        const selectedMatchId = parseInt(e.target.value, 10);
        const match = matches.find(match => match.id === selectedMatchId);
        setSelectedMatch(match);
        if (match) {
            handleMatchSelect(match);
        }
    };

    return (
        <MatchSelectorContainer>
            <Select value={selectedCompetitionType} onChange={(e) => setSelectedCompetitionType(e.target.value)}>
                <option value="">Select Competition Type</option>
                {competitionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.nombre}</option>
                ))}
            </Select>

            <Select value={selectedCompetition} onChange={(e) => setSelectedCompetition(e.target.value)} disabled={!selectedCompetitionType}>
                <option value="">Select Competition</option>
                {competitions.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.nombre_comp}</option>
                ))}
            </Select>

            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} disabled={!selectedCompetition}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
            </Select>

            <Select value={selectedPhase} onChange={(e) => setSelectedPhase(e.target.value)} disabled={!selectedCategory}>
                <option value="">Select Phase</option>
                {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.nombre}</option>
                ))}
            </Select>

            <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} disabled={!selectedPhase}>
                <option value="">Select Group</option>
                {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.nombre}</option>
                ))}
            </Select>

            <Select value={selectedMatch?.id || ''} onChange={handleMatchDropdownChange} disabled={!selectedGroup}>
                <option value="">Select Match</option>
                {matches.map(match => (
                    <option key={match.id} value={match.id}>{match.equipo_local} vs {match.equipo_visitante}</option>
                ))}
            </Select>
        </MatchSelectorContainer>
    );
};

export default MatchSelector;
