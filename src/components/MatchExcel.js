import React from 'react';
import * as XLSX from 'xlsx';
// import DescriptionIcon from '@mui/icons-material/Description';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const stats = [
    { label: "Saques", key: "serve" },
    { label: "Puntos directos de saque", key: "ace" },
    { label: "Errores de saque", key: "serveError" },
    { label: "Recepciones", key: "reception" },
    { label: "Errores de recepcion", key: "receptionError" },
    { label: "Defensas", key: "dig" },
    { label: "Errores de defensa", key: "digError" },
    { label: "Ataques", key: "attack" },
    { label: "Puntos de ataque", key: "attackPoint" },
    { label: "Errores de ataque", key: "attackError" },
    { label: "Bloqueos intentados", key: "block" },
    { label: "Puntos de Bloqueo", key: "blockPoint" },
    { label: "Errores de Bloqueo", key: "blockOut" },
    { label: "Faltas cometidas", key: "fault" },
    { label: "Total errores cometidos", key: "selfErrors" },
    { label: "Efectividad del servicio", key: "serviceEffectiveness" },
    { label: "Efectividad del ataque", key: "attackEffectiveness" },
    { label: "Efectividad de la defensa", key: "defenseEffectiveness" },
];

const generateExcel = (teams, statistics, setScores) => {
    const workbook = XLSX.utils.book_new();

    // Create statistics sheet
    const statsData = [
        ['Estadísticas', teams.teamA, teams.teamB],
        ...stats.map(stat => [
            stat.label,
            statistics.teamA[stat.key],
            statistics.teamB[stat.key]
        ])
    ];
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Estadísticas');

    // Create set scores sheet
    const setScoresData = [
        ['Set', teams.teamA, teams.teamB],
        ...setScores.map((setScore, index) => [
            `Set ${index + 1}`,
            setScore.teamA,
            setScore.teamB
        ])
    ];
    const setScoresSheet = XLSX.utils.aoa_to_sheet(setScoresData);
    XLSX.utils.book_append_sheet(workbook, setScoresSheet, 'Set Scores');

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    link.download = `${teams.teamA}_vs_${teams.teamB}_${currentDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const MatchExcel = ({ teams, statistics, setScores }) => (
    <button onClick={() => generateExcel(teams, statistics, setScores)} style={{ display: 'flex', alignItems: 'center', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        {/* <DescriptionIcon style={{ marginRight: '5px' }} /> */}
        <FontAwesomeIcon icon={faFileExcel} style={{ marginRight: '5px' }} />
        Descargar XLSX
    </button>);

export default MatchExcel;
