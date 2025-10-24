import React from 'react';
import styled from 'styled-components';

const StatisticsContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #4CAF50;
  color: white;
  padding: 8px;
  text-align: center;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
`;

const calculatePercentage = (value, total) => {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(2)}%`;
};

const Statistics = ({ teams, statistics }) => {
  const serviceEffectivenessA = calculatePercentage(
    statistics.teamA.ace + statistics.teamB.receptionError,
    statistics.teamA.serve
  );

  const serviceEffectivenessB = calculatePercentage(
    statistics.teamB.ace + statistics.teamA.receptionError,
    statistics.teamB.serve
  );

  const attackEffectivenessA = calculatePercentage(
    statistics.teamA.attackPoint + statistics.teamB.digError,
    statistics.teamA.attack
  );

  const attackEffectivenessB = calculatePercentage(
    statistics.teamB.attackPoint + statistics.teamA.digError,
    statistics.teamB.attack
  );

  const defenseEffectivenessA = calculatePercentage(
    statistics.teamA.dig - statistics.teamA.digError,
    statistics.teamB.attack
  );

  const defenseEffectivenessB = calculatePercentage(
    statistics.teamB.dig - statistics.teamB.digError,
    statistics.teamA.attack
  );

  return (
    <StatisticsContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Statistic</TableHeader>
            <TableHeader>{teams.teamA}</TableHeader>
            <TableHeader>{teams.teamB}</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableRow>
            <TableCell>Serves</TableCell>
            <TableCell>{statistics.teamA.serve}</TableCell>
            <TableCell>{statistics.teamB.serve}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Aces</TableCell>
            <TableCell>{statistics.teamA.ace}</TableCell>
            <TableCell>{statistics.teamB.ace}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Serve Errors</TableCell>
            <TableCell>{statistics.teamA.serveError}</TableCell>
            <TableCell>{statistics.teamB.serveError}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Receptions</TableCell>
            <TableCell>{statistics.teamA.reception}</TableCell>
            <TableCell>{statistics.teamB.reception}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Reception Errors</TableCell>
            <TableCell>{statistics.teamA.receptionError}</TableCell>
            <TableCell>{statistics.teamB.receptionError}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Digs</TableCell>
            <TableCell>{statistics.teamA.dig}</TableCell>
            <TableCell>{statistics.teamB.dig}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Dig Errors</TableCell>
            <TableCell>{statistics.teamA.digError}</TableCell>
            <TableCell>{statistics.teamB.digError}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Attacks</TableCell>
            <TableCell>{statistics.teamA.attack}</TableCell>
            <TableCell>{statistics.teamB.attack}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Attack Points</TableCell>
            <TableCell>{statistics.teamA.attackPoint}</TableCell>
            <TableCell>{statistics.teamB.attackPoint}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Attack Errors</TableCell>
            <TableCell>{statistics.teamA.attackError}</TableCell>
            <TableCell>{statistics.teamB.attackError}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Blocks</TableCell>
            <TableCell>{statistics.teamA.block}</TableCell>
            <TableCell>{statistics.teamB.block}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Block Points</TableCell>
            <TableCell>{statistics.teamA.blockPoint}</TableCell>
            <TableCell>{statistics.teamB.blockPoint}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Block Outs</TableCell>
            <TableCell>{statistics.teamA.blockOut}</TableCell>
            <TableCell>{statistics.teamB.blockOut}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Faults</TableCell>
            <TableCell>{statistics.teamA.fault}</TableCell>
            <TableCell>{statistics.teamB.fault}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Service Effectiveness</TableCell> {/* New calculated stat */}
            <TableCell>{serviceEffectivenessA}</TableCell>
            <TableCell>{serviceEffectivenessB}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Attack Effectiveness</TableCell> {/* New calculated stat */}
            <TableCell>{attackEffectivenessA}</TableCell>
            <TableCell>{attackEffectivenessB}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Defense Effectiveness</TableCell> {/* New calculated stat */}
            <TableCell>{defenseEffectivenessA}</TableCell>
            <TableCell>{defenseEffectivenessB}</TableCell>
          </TableRow>
        </tbody>
      </Table>
    </StatisticsContainer>
  );
};

export default Statistics;
