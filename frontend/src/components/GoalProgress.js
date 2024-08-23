import React from 'react';

const GoalProgress = ({ goals }) => {
    const completed = goals.filter(g => g.status === 'Completed').length;
    const total = goals.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return (
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-md rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg mb-2 text-white">Journey Progress</h3>
            <div className="w-full bg-gray-600 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${percentage}%`}}></div>
            </div>
            <p className="text-sm text-gray-300">{completed} of {total} goals completed</p>
        </div>
    );
};

export default GoalProgress;