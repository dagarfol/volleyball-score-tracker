// Controls.js
import React from 'react';

const Controls = ({ config, setConfig, socket }) => {

    const handleToggle = (section, key) => {
        const updatedConfig = {
            ...config,
            [section]: {
                ...config[section],
                [key]: !config[section][key],
            },
        };
        setConfig(updatedConfig);
        socket.emit('updateConfig', updatedConfig);
    };

    const handleSelectChange = (section, key, value) => {
        const updatedConfig = {
            ...config,
            [section]: {
                ...config[section],
                [key]: value,
            },
        };
        setConfig(updatedConfig);
        socket.emit('updateConfig', updatedConfig);
    };

    return (
        <div>
            <h2>Controls</h2>
            <div>
                <h3>Scoreboard</h3>
                <button onClick={() => handleToggle('scoreboard', 'enabled')}>
                    {config.scoreboard.enabled ? 'Disable' : 'Enable'}
                </button>
                <select
                    value={config.scoreboard.type}
                    onChange={(e) => handleSelectChange('scoreboard', 'type', e.target.value)}
                >
                    <option value="classic">single line</option>
                    <option value="vertical-table">Stacked</option>
                </select>
                <select
                    value={config.scoreboard.position}
                    onChange={(e) => handleSelectChange('scoreboard', 'position', e.target.value)}
                >
                    <option value="top">Top</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom">Bottom</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                </select>
            </div>
            <div>
                <h3>Matchup</h3>
                <button onClick={() => handleToggle('matchup', 'enabled')}>
                    {config.matchup.enabled ? 'Disable' : 'Enable'}
                </button>
            </div>
            <div>
                <h3>Lower Third</h3>
                <button onClick={() => handleToggle('lowerThird', 'enabled')}>
                    {config.lowerThird.enabled ? 'Disable' : 'Enable'}
                </button>
            </div>
            <div>
                <h3>Team Comparison Table</h3>
                <button onClick={() => handleToggle('teamComparison', 'enabled')}>
                    {config.teamComparison.enabled ? 'Disable' : 'Enable'}
                </button>
            </div>
            <div>
                <h3>After Match Stats</h3>
                <button onClick={() => handleToggle('afterMatch', 'enabled')}>
                    {config.afterMatch.enabled ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => handleToggle('afterMatch', 'showStats')}>
                    {config.afterMatch.showStats ? 'Hide Stats' : 'Show Stats'}
                </button>
            </div>
        </div>
    );
};

export default Controls;
