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
    const [categories, setCompetitions] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [phases, setPhases] = useState([]);
    const [groups, setGroups] = useState([]);
    const [matches, setMatches] = useState([]);
    const [rankingData, setRankingData] = useState([]);

    const [selectedCompetitionType, setSelectedCompetitionType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
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
                    console.error('Error fetching categories:', error);
                }
            };

            fetchCompetitions();
        }
    }, [selectedCompetitionType]);

    useEffect(() => {
        if (selectedCategory) {
            const fetchDivisions = async () => {
                try {
                    const response = await fetch(`https://intranet.fmvoley.com/api/competiciones/getCompeticionesTemporada?competicionId=${selectedCategory}`);
                    const data = await response.json();
                    setDivisions(data.content);
                } catch (error) {
                    console.error('Error fetching divisions:', error);
                }
            };

            fetchDivisions();
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedDivision) {
            const fetchPhases = async () => {
                try {
                    const response = await fetch(`https://intranet.fmvoley.com/api/competiciones/getFasesCompeticion?competicionTemporadaId=${selectedDivision}`);
                    const data = await response.json();
                    setPhases(data.content);
                } catch (error) {
                    console.error('Error fetching phases:', error);
                }
            };

            fetchPhases();
        }
    }, [selectedDivision]);

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
        const teamAData = rankingData.find(team => team.nombre.trim() === selectedMatch.equipo_local.trim());
        const teamBData = rankingData.find(team => team.nombre.trim() === selectedMatch.equipo_visitante.trim());
        const category = categories.find(type => type.id === selectedCategory);
        const division = divisions.find(type => type.id === selectedDivision);
        const phase = phases.find(comp => comp.id === selectedPhase);

        const matchDetails = {
            teamA: teamAData.nombre,
            teamB: teamBData.nombre,
            teamALogo: teamAData.imagen,
            teamBLogo: teamBData.imagen,
            matchHeader: `${category.categoria_sexo} - ${division.nombre}`,
            extendedInfo: `Fase ${phase.nombre} - Jornada ${journeyData.numero}`,
            stadium: `Pabellón ${selectedMatch.pabellon}`,
            competitionLogo: 'https://fmvoley.com/images/logo.svg',
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
                <option value="">Tipo de competición</option>
                {competitionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.nombre}</option>
                ))}
            </Select>

            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} disabled={!selectedCompetitionType}>
                <option value="">Categoría</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre_comp}</option>
                ))}
            </Select>

            <Select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} disabled={!selectedCategory}>
                <option value="">División</option>
                {divisions.map(div => (
                    <option key={div.id} value={div.id}>{div.nombre}</option>
                ))}
            </Select>

            <Select value={selectedPhase} onChange={(e) => setSelectedPhase(e.target.value)} disabled={!selectedDivision}>
                <option value="">Fase</option>
                {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.nombre}</option>
                ))}
            </Select>

            <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} disabled={!selectedPhase}>
                <option value="">Grupo</option>
                {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.nombre}</option>
                ))}
            </Select>

            <Select value={selectedMatch?.id || ''} onChange={handleMatchDropdownChange} disabled={!selectedGroup}>
                <option value="">Partido</option>
                {matches.map(match => (
                    <option key={match.id} value={match.id}>{match.equipo_local} vs {match.equipo_visitante}</option>
                ))}
            </Select>
        </MatchSelectorContainer>
    );
};

export default MatchSelector;
