import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import GoalCard from './components/GoalCard';
import GoalProgress from './components/GoalProgress';

const API_URL = 'https://horizon-4i6z.onrender.com/api';

function App() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const response = await axios.get(`${API_URL}/goals`);
    setGoals(response.data);
  };

  const addGoal = async () => {
    if (newGoal.title && newGoal.description) {
      const response = await axios.post(`${API_URL}/goals`, newGoal);
      setGoals([...goals, response.data]);
      setNewGoal({ title: '', description: '' });
      setIsDialogOpen(false);
    }
  };

  const updateGoalStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/goals/${id}`, { status });
    setGoals(goals.map(goal => goal.id === id ? response.data : goal));
  };

  const deleteGoal = async (id) => {
    await axios.delete(`${API_URL}/goals/${id}`);
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl relative z-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">Horizon</h1>
      
      <GoalProgress goals={goals} />

      <button 
        className="w-full mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50" onClick={() => setIsDialogOpen(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Add a New Goal</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  placeholder="Goal Title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="mb-2 px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md w-full text-white placeholder-gray-400"
                />
                <textarea
                  placeholder="Goal Description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="mb-2 px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md w-full text-white placeholder-gray-400"
                />
                <button 
                  onClick={addGoal}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdateStatus={updateGoalStatus}
            onDelete={deleteGoal}
          />
        ))}
      </div>
    </div>
  );
}

export default App;