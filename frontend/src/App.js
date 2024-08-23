import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Wand2 } from 'lucide-react';
import { HfInference } from '@huggingface/inference';
import GoalCard from './components/GoalCard';
import GoalProgress from './components/GoalProgress';

const API_URL = 'https://horizon-4i6z.onrender.com/api';
const HF_API_KEY = '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';  // Replace with your actual API key
const hf = new HfInference(HF_API_KEY);

function App() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals`);
      setGoals(response.data);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to fetch goals. Please try again.');
    }
  };

  const addGoal = async () => {
    if (newGoal.title && newGoal.description) {
      try {
        const response = await axios.post(`${API_URL}/goals`, newGoal);
        setGoals([...goals, response.data]);
        setNewGoal({ title: '', description: '' });
        setIsDialogOpen(false);
      } catch (err) {
        console.error('Error adding goal:', err);
        setError('Failed to add goal. Please try again.');
      }
    }
  };

  const updateGoalStatus = async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/goals/${id}`, { status });
      setGoals(goals.map(goal => goal.id === id ? response.data : goal));
    } catch (err) {
      console.error('Error updating goal status:', err);
      setError('Failed to update goal status. Please try again.');
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${API_URL}/goals/${id}`);
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal. Please try again.');
    }
  };

  const generateDescription = async () => {
    if (!newGoal.title) return;
  
    setIsGenerating(true);
    setError(null);
    console.log('Generating description for:', newGoal.title);
  
    try {
      // Generate a summary of the goal title
      const result = await hf.textGeneration({
        model: 'gpt2',
        inputs: `Summarize: "${newGoal.title}".`,
        parameters: { max_new_tokens: 50, temperature: 0.7 }
      });
  
      console.log('Generated result:', result);
  
      if (result && result.generated_text) {
        // Remove the initial prompt from the output
        const description = result.generated_text.replace(`Summarize: "${newGoal.title}".`, '').trim();
        setNewGoal(prev => ({ ...prev, description }));
      } else {
        throw new Error('No generated text received from the API');
      }
    } catch (err) {
      console.error('Error generating description:', err);
      setError(`Failed to generate description: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  
  

  return (
    <div className="container mx-auto p-4 max-w-3xl relative z-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">Event Horizon</h1>
      
      <GoalProgress goals={goals} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
                <div className="flex mb-2">
                  <textarea
                    placeholder="Goal Description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="px-3 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-l-md w-full text-white placeholder-gray-400"
                  />
                  <button
                    onClick={generateDescription}
                    disabled={isGenerating || !newGoal.title}
                    className="px-2 bg-purple-500 text-white rounded-r-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:bg-gray-400"
                  >
                    {isGenerating ? 'Generating...' : <Wand2 className="h-5 w-5" />}
                  </button>
                </div>
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