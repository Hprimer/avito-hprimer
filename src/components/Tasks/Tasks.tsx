import React, { useEffect, useState } from 'react'
import { ExtendedTask } from '../../types/tasks';
import './Tasks.css';
import Popup from '../Popup/Popup';
import { MyBoard } from '../../types/boards';

function Tasks() {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ExtendedTask[]>([]);
  const [boards, setBoards] = useState<MyBoard[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedBoardName, setSelectedBoardName] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>('');;
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
  fetch(`/api/v1/tasks`)    
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const tasksData = Array.isArray(data?.data) ? data.data : [];
      setTasks(tasksData);
      setFilteredTasks(tasksData); 
      setError(null);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      setError("Не удалось загрузить задачи");
      setTasks([]);
      setFilteredTasks([]);
    })
    .finally(() => setLoading(false));
  
  
  fetch(`/api/v1/boards`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => setBoards(data.data || []))
    .catch(error => {
      console.error("Fetch error:", error);
      setError("Не удалось загрузить доски");
      setBoards([]);
    });
  
  }, []);
  
  
  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };    
  const handleClosePopup = () => {
     setSelectedTaskId(null);
  };
  
  // Обработчик обновления задачи
  const handleTaskUpdate = (updatedTask: ExtendedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    handleClosePopup();
  };
  // Обработчик поиска
  const handleSearch = (query: string) => {
    setSearchQuery(query);    
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) 
    );    
    setFilteredTasks(filtered);
  };
  
  // Применение фильтров
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedPriority, selectedBoardName, tasks]);
  
  
  const applyFilters = () => {
    let result = [...tasks];
  
    if (searchQuery) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    }
  
    if (selectedPriority) {
      result = result.filter(task => 
        task.priority === selectedPriority
      );
    }
  
    if (selectedBoardName) {
      result = result.filter(task => 
        task.boardName === selectedBoardName
      );
    }
  
    setFilteredTasks(result);
  };
  
  
  const resetFilters = () => {      
    setSelectedBoardName('');
    setSelectedPriority('');
    setSearchQuery('');
  };
  
  
  if (loading) return <p>Загрузка задач...</p>;
  if (error) return <p className="error">{error}</p>;
  
  return (
    <div className='container '>
      <h1 className='task-head'>Список задач</h1>
      <div className="funkcional-block">                
        <div className="search-task">
          <input
          className='input-search-task'
          placeholder='Поиск'
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
  
        <div className="filter-task"  >
          <div className='togle-filter-btn' onClick={() => setShowFilters(!showFilters)}>
            Фильтры 
          </div>
        
          {showFilters && (
            <div className="filters-dropdown">
              <div className="filter-section">
                  <h4>Доска:</h4>
                    <select
                      value={selectedBoardName || ''}
                      onChange={(e) => 
                        setSelectedBoardName(e.target.value ? String(e.target.value) : "")
                      }
                      className="filter-select"
                    >
                      <option value="">Все доски</option>
                      {boards.map(board => (
                        <option key={board.name} value={board.name}>
                          {board.name}
                        </option>
                      ))}
                    </select>
              </div>
          
              <div className="filter-section">
                <h4>Приоритет:</h4>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Все приоритеты</option>
                  <option value="High">Высокий</option>
                  <option value="Medium">Средний</option>
                  <option value="Low">Низкий</option>
                </select>
              </div>
          
              <button 
                className="reset-filters"
                onClick={resetFilters}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>  
      </div> 
  
  
      {filteredTasks.map(task => (
        <li key={task.id} className="board-item" onClick={() => handleTaskClick(task.id)}>
          <h2>{task.title}</h2>
        </li>
      ))}
              
      {selectedTaskId !== null && (
        <Popup
          mode="edit"
          source="tasks"
          taskId={selectedTaskId}  
          onClose={handleClosePopup} 
          onTaskUpdate={handleTaskUpdate}
        />
      )}
                      
    </div>
  )
}

export default Tasks