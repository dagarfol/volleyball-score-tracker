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

const Statistics = ({ teams, statistics }) => {
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
            <TableCell>Faults</TableCell> {/* New stat */}
            <TableCell>{statistics.teamA.fault}</TableCell>
            <TableCell>{statistics.teamB.fault}</TableCell>
          </TableRow>
        </tbody>
      </Table>
    </StatisticsContainer>
  );
};

export default Statistics;
