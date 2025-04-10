import React, { useEffect, useState } from 'react'
import { ExtendedTask } from '../../types/tasks';
import './Tasks.css';

function Tasks() {
    const [tasks, setTasks] = useState<ExtendedTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
    fetch(`api/v1/tasks`)
        
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const tasksData = Array.isArray(data?.data) ? data.data : [];
            setTasks(tasksData);
            setError(null);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            setError("Не удалось загрузить задачи");
            setTasks([]);
        })
        .finally(() => setLoading(false));
    }, []);
    
    
        if (loading) return <p>Загрузка задач...</p>;
        if (error) return <p className="error">{error}</p>;

    return (
        <div className='container task-head'>
            <h1 className='tasks-head'>Список задач</h1>
            <div className="funkcional-block">
                <div className="search-task"><input className='input-search-task'
                    
                    placeholder='Поиск'    
                /></div>
                    
                <div className="filter-task">
                    Фильтры
                </div>
            </div>
            {tasks.map(task => (
                <li key={task.id} className="board-item">
                    <h2>{task.title}</h2>                              
                </li>
            ))}        
        </div>
  )
}

export default Tasks