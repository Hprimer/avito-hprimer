// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import './Board.css';
// import { MyBoard } from '../../types/boards';
// import { MyTask } from '../../types/types';


// function Board() {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const [tasks, setTasks] = useState<MyTask[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const board = location.state?.board as MyBoard | undefined;

//   useEffect(() => {
//     if (!id) return;

//     fetch(`/api/v1/boards/${id}`)
//       .then(res => {
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         return res.json();
//       })
//       .then(data => {
//         setTasks(data.data || []);
//         setError(null);
//       })
//       .catch(error => {
//         console.error("Fetch error:", error);
//         setError("Не удалось загрузить задачи");
//         setTasks([]);
//       })
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <p>Загрузка задач...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className="container">
//       {board && <h1>{board.name}</h1>}
      
//       <div className="tasks-list">
//         {tasks.map(task => (
//           <div key={task.id} className="task-card">
//             <h3>{task.title}</h3>
//             <p>{task.description}</p>
//             <div className="task-meta">
//               <span className={`priority ${task.priority.toLowerCase()}`}>
//                 {task.priority}
//               </span>
//               <span className={`status ${task.status.toLowerCase()}`}>
//                 {task.status}
//               </span>
//             </div>
            
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Board;

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Board.css';
import { MyBoard } from '../../types/boards';
import { MyTask } from '../../types/tasks';

const STATUS_CONFIG = {
  'Backlog': { title: 'To Do', class: 'todo' },
  'InProgress': { title: 'In Progress', class: 'in-progress' },
  'Done': { title: 'Done', class: 'done' }
} as const;

function Board() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const board = location.state.board as MyBoard;

  useEffect(() => {
    if (!id) return;

  fetch(`/api/v1/boards/${id}`)
    
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      setTasks(data.data || []);
      setError(null);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      setError("Не удалось загрузить задачи");
      setTasks([]);
    })
    .finally(() => setLoading(false));
  }, [id]);

  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status as keyof typeof STATUS_CONFIG;
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {} as Record<keyof typeof STATUS_CONFIG, MyTask[]>);

  if (loading) return <p>Загрузка задач...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container ">
    {board && <h1 className='board-head'>{board.name}</h1>}
    
    <div className="kanban-board">
      {Object.entries(STATUS_CONFIG).map(([statusKey, { title, class: statusClass }]) => (
      <div key={statusKey} className={`status-column ${statusClass}`}>
        <div className="status-header">
          <h3>{title}</h3>
          <span className="task-count">
            ({groupedTasks[statusKey as keyof typeof STATUS_CONFIG]?.length || 0})
          </span>
        </div>
        
        <div className="tasks-list">
        {groupedTasks[statusKey as keyof typeof STATUS_CONFIG]?.map(task => (
          <div key={task.id} className="task-card">
          <div className="task-content">
            <h4 className="task-title">{task.title}</h4>
            {/* <p className="task-description">{task.description}</p> */}            
            <div className="task-meta">
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
          </div>
          </div>
        )) || <div>Нет задач</div>}
        </div>
      </div>
      ))}
    </div>
    </div>
  );
}

export default Board;