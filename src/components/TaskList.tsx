import React, { useState } from 'react';
import { Task } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Plus, Trash2, Check, Circle } from 'lucide-react';

export default function TaskList() {
    const [tasks, setTasks] = useLocalStorage<Task[]>('zen-tasks', []);
    const [newTaskText, setNewTaskText] = useState('');

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            text: newTaskText.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        setTasks((prev) => [newTask, ...prev]);
        setNewTaskText('');
    };

    const toggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    return (
        <div className="bg-zen-card p-6 rounded-3xl shadow-lg border border-zen-accent/10 h-full flex flex-col">
            <h2 className="text-xl font-medium mb-4 text-zen-text flex items-center gap-2">
                <span className="w-1.5 h-6 bg-zen-primary rounded-full"></span>
                Tasks
            </h2>

            <form onSubmit={addTask} className="mb-4 relative">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-zen-bg/50 rounded-xl py-3 px-4 pr-12 text-zen-text placeholder:text-zen-muted focus:outline-none focus:ring-1 focus:ring-zen-primary transition-all"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-zen-primary/10 text-zen-primary rounded-lg hover:bg-zen-primary hover:text-white transition-colors"
                >
                    <Plus size={18} />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {tasks.length === 0 ? (
                    <div className="text-center text-zen-muted py-8 text-sm">
                        No tasks yet. Stay focused!
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${task.completed ? 'bg-zen-bg/30' : 'bg-zen-bg/50 hover:bg-zen-bg/80'
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-zen-primary' : 'text-zen-muted group-hover:text-zen-highlight'
                                    }`}
                            >
                                {task.completed ? <Check size={20} /> : <Circle size={20} />}
                            </button>

                            <span
                                className={`flex-1 text-sm transition-all ${task.completed ? 'text-zen-muted line-through' : 'text-zen-text'
                                    }`}
                            >
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-zen-muted hover:text-red-400 transition-all p-1.5"
                                title="Delete task"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
