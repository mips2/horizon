import React, { useState, useEffect } from 'react';
import { PlusCircle, Sunrise, Sun, Sunset, X } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const GoalStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const getStatusIcon = (status) => {
  switch(status) {
    case GoalStatus.NOT_STARTED: return <Sunrise className="h-4 w-4" />;
    case GoalStatus.IN_PROGRESS: return <Sun className="h-4 w-4" />;
    case GoalStatus.COMPLETED: return <Sunset className="h-4 w-4" />;
    default: return null;
  }
};

const GoalCard = ({ goal, onUpdateStatus, onDelete }) => (
  <Card className="mb-4 overflow-hidden">
    <div className={`h-2 ${
      goal.status === GoalStatus.COMPLETED ? 'bg-green-500' :
      goal.status === GoalStatus.IN_PROGRESS ? 'bg-yellow-500' :
      'bg-gray-300'
    }`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="font-bold text-lg">{goal.title}</h3>
      <div className="flex space-x-2">
        <Button size="sm" variant={goal.status === GoalStatus.NOT_STARTED ? 'default' : 'outline'} onClick={() => onUpdateStatus(goal.id, GoalStatus.NOT_STARTED)}><Sunrise className="h-4 w-4" /></Button>
        <Button size="sm" variant={goal.status === GoalStatus.IN_PROGRESS ? 'default' : 'outline'} onClick={() => onUpdateStatus(goal.id, GoalStatus.IN_PROGRESS)}><Sun className="h-4 w-4" /></Button>
        <Button size="sm" variant={goal.status === GoalStatus.COMPLETED ? 'default' : 'outline'} onClick={() => onUpdateStatus(goal.id, GoalStatus.COMPLETED)}><Sunset className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(goal.id)}><X className="h-4 w-4" /></Button>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{goal.description}</p>
      <div className="mt-2 flex items-center">
        <div className="text-sm font-medium mr-2">{getStatusIcon(goal.status)}</div>
        <div className="text-sm text-gray-500">{goal.status}</div>
      </div>
    </CardContent>
  </Card>
);

const GoalProgress = ({ goals }) => {
  const completed = goals.filter(g => g.status === GoalStatus.COMPLETED).length;
  const total = goals.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="font-bold text-lg">Journey Progress</h3>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">{completed} of {total} goals completed</p>
      </CardContent>
    </Card>
  );
};

const HorizonDashboard = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const addGoal = async () => {
    if (newGoal.title && newGoal.description) {
      try {
        const response = await fetch('http://localhost:5000/api/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newGoal, status: GoalStatus.NOT_STARTED }),
        });
        const data = await response.json();
        setGoals([...goals, data]);
        setNewGoal({ title: '', description: '' });
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    }
  };

  const updateGoalStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setGoals(goals.map(goal => goal.id === id ? { ...goal, status } : goal));
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'DELETE',
      });
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Horizon</h1>
      
      <GoalProgress goals={goals} />

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full mb-6">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Goal</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            className="mb-2"
          />
          <Textarea
            placeholder="Goal Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            className="mb-2"
          />
          <Button onClick={addGoal}>Add Goal</Button>
        </DialogContent>
      </Dialog>

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
};

export default HorizonDashboard;