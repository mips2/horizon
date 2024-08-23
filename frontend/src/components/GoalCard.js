import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const GoalStatus = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
};

const getStatusIcon = (status) => {
    switch(status) {
        case GoalStatus.NOT_STARTED: return <MoonIcon className="h-5 w-5" />;
        case GoalStatus.IN_PROGRESS: return <SunIcon className="h-5 w-5" />;
        case GoalStatus.COMPLETED: return <CheckCircleIcon className="h-5 w-5" />;
        default: return null;
    }
};

const GoalCard = ({ goal, onUpdateStatus, onDelete }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg mb-4 overflow-hidden border border-gray-200 border-opacity-20"
    >
        <div className={`h-2 ${
            goal.status === GoalStatus.COMPLETED ? 'bg-green-500' :
            goal.status === GoalStatus.IN_PROGRESS ? 'bg-yellow-500' :
            'bg-purple-500'
        }`} />
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-white">{goal.title}</h3>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full ${goal.status === GoalStatus.NOT_STARTED ? 'bg-purple-400 bg-opacity-30 text-purple-200' : 'bg-gray-600 bg-opacity-30 text-gray-200'}`}
                        onClick={() => onUpdateStatus(goal.id, GoalStatus.NOT_STARTED)}
                    >
                        <MoonIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full ${goal.status === GoalStatus.IN_PROGRESS ? 'bg-yellow-400 bg-opacity-30 text-yellow-200' : 'bg-gray-600 bg-opacity-30 text-gray-200'}`}
                        onClick={() => onUpdateStatus(goal.id, GoalStatus.IN_PROGRESS)}
                    >
                        <SunIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full ${goal.status === GoalStatus.COMPLETED ? 'bg-green-400 bg-opacity-30 text-green-200' : 'bg-gray-600 bg-opacity-30 text-gray-200'}`}
                        onClick={() => onUpdateStatus(goal.id, GoalStatus.COMPLETED)}
                    >
                        <CheckCircleIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-red-400 bg-opacity-30 text-red-200"
                        onClick={() => onDelete(goal.id)}
                    >
                        <TrashIcon className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>
            <p className="text-gray-300 mb-4">{goal.description}</p>
            <div className="flex items-center text-sm text-gray-400">
                <div className="mr-2">{getStatusIcon(goal.status)}</div>
                <div>{goal.status}</div>
            </div>
        </div>
    </motion.div>
);

export default GoalCard;