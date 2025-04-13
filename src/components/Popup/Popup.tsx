import React, { useEffect, useState } from 'react';
import './popup.css';
import { ExtendedTask } from '../../types/tasks';
import { Link, NavLink } from 'react-router-dom';
import { MyBoard } from '../../types/boards';

type PopupProps = {
  mode: 'create' | 'edit';
  source: 'header' | 'board' | 'tasks';
  boardId?: number;
  boardName?: string;
  taskId?: number;
  onClose: () => void;
  onTaskUpdate?: (updatedTaskId: ExtendedTask) => void;
};
interface MyUser  {
  id: number;
  fullName: string;
  email: string;
  description:string;
  avatarUrl: string;
  teamId: number;
  teamName: string;
  tasksCount: number;
};

function Popup({ mode, source, boardId, boardName, taskId, onClose, onTaskUpdate}: PopupProps) {
  const [formData, setFormData] = useState<Partial<ExtendedTask>>({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState<string | null>(null);
  const [boards, setBoards] = useState<MyBoard[]>([]);
  const [users,setUsers] = useState<MyUser[]>([])

    // Загрузка задачи при редактировании
    useEffect(() => {
        if (mode === 'edit' && taskId) {
          setLoading(true);
          fetch(`/api/v1/tasks/${taskId}`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              return res.json();
            })
            .then(data => {
              setFormData({
                ...data.data,
                // boardName: boardName,
                assigneeId: data.data.assignee?.id || 0
              });
              
            })
            .catch(err => {
              console.error('Error fetching task:', err);
              setError('Не удалось загрузить задачу');
            })
            .finally(() => setLoading(false));
        }
      }, [mode, taskId]);

      // Поиск id доски  по названию доски так как в api  всегда передается нулевая доска ((
      useEffect(() => {
        if (source === "tasks" &&  formData.boardName && boards.length > 0) {
          const foundBoard = boards.find(board => board.name === formData.boardName);
          if (foundBoard) {
            setFormData(prev => ({ ...prev, boardId: foundBoard.id }));
          }
        }
      }, [source, formData.boardName, boards]); 

  // Автозаполнение boardId/boardName при создании из доски
  useEffect(() => {
    if (source === 'board' && boardId) {
      setFormData(prev => ({ ...prev, boardId }));
    }
    if (source === 'board' && boardName) {
      setFormData(prev => ({ ...prev, boardName }));
    }
  }, [source, boardId, boardName]);

  // Считывание досок при создании зaдaчи из header/tasks 
  useEffect(() => {
    if (source === 'header' || source === 'tasks' ) {
      // if (source === 'header'  ) {

      fetch('/api/v1/boards')
        .then(res => res.json())
        .then(data => {
          setBoards(data.data || []);
          // setFormData({boardId: boards[]})
        })
        // .catch(console.error);
        .catch(err => {
          console.error('Error fetching task:', err);
          setError('Не удалось загрузить задачу');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // загрузка исполнителей
  useEffect(() => {
    fetch('/api/v1/users')
    .then(res => res.json())
    .then(data => {
      setUsers(data.data || []);
    })
    .catch(err => {
      console.error('Error fetching task:', err);
      setError('Не удалось загрузить исполнителей');
    })
    .finally(() => setLoading(false));
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = mode === 'edit' 
        ? `/api/v1/tasks/update/${taskId}`
        : '/api/v1/tasks/create';

      const body =  {
        assigneeId: formData.assigneeId,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        title: formData.title ,      
        boardId: formData.boardId,        
        boardName: formData.boardName,
      };
      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Ошибка сохранения');
      const result = await response.json();
      // console.log(result)
      if (mode === 'create' && onTaskUpdate) {
        const newTaskId = result.data.id;
      const newTaskResponse = await fetch(`/api/v1/tasks/${newTaskId}`);
      if (!newTaskResponse.ok) throw new Error('Ошибка получения данных задачи');
      const newTaskData = await newTaskResponse.json();
      
      onTaskUpdate(newTaskData.data); // Передаём полные данные
      } else if(onTaskUpdate) {
        const updatedTaskResponse = await fetch(`/api/v1/tasks/${taskId}`);
        if (!updatedTaskResponse.ok) throw new Error('Ошибка при получении задачи');
        const updatedTaskData = await updatedTaskResponse.json();
        onTaskUpdate(updatedTaskData.data); // Передаём свежие данные
      }
  
      onClose();

    } catch (err) {
        setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ExtendedTask, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="popup">Загрузка...</div>;

  return (
    <section className="popup">
      <div className="popup-block">
        <form className="popup-content" onSubmit={handleSubmit}>
          <h2>{mode === 'edit' ? 'Редактировать задачу' : 'Создать задачу'}</h2>

          <input
            type="text"
            placeholder="Название задачи"
            value={formData.title || ''}
            onChange={e => handleChange('title', e.target.value)}
            required
          />

          <textarea
            placeholder="Описание"
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            required
          />

          {/* // Выбор приоритета, по дефолту "Низкий"   */}
          <select
            value={formData.priority || 'Medium'}
            onChange={e => handleChange('priority', e.target.value)}
            required
          >
            <option value="Low">Низкий</option>
            <option value="Medium">Средний</option>
            <option value="High">Высокий</option>
          </select>

          {/* // Выбор статуса по дефолту "беклог"   */}
          <select
              value={formData.status || 'Backlog'}
              onChange={e => handleChange('status', e.target.value)}
              required
            >
              <option value="Backlog">Бэклог</option>
              <option value="InProgress">В работе</option>
              <option value="Done">Готово</option>
            </select>



          {/* // Выбор ID исполнителя */}
          {/* <input
            type="number"
            placeholder="ID исполнителя"
            value={formData.assigneeId || ''}
            onChange={e => handleChange('assigneeId', Number(e.target.value))}
            required
          /> */}

          {/* // Исполнители */}          
            <select
              value={formData.assigneeId || ""}
              onChange={e => handleChange('assigneeId', Number(e.target.value))}
              required
            >
              <option value="" disabled>Выберите исполнителя</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>

          {/* // Варианты досок для header (все доски) */}
          {mode === 'create' && source === 'header' && (
            <select
              value={formData.boardId || ""}
              onChange={e => handleChange('boardId', Number(e.target.value))}
              required={source === 'header'}
            >
              <option value="" disabled>Выберите доску</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          )}
          
          {/* // Вывод доски на которой находится задача  */}
          { (source === 'board' || source === 'tasks') &&(
            <select
            value={formData.boardId}
            onChange={e => handleChange('status', e.target.value)}            
          >
            <option value={formData.boardId}>{formData.boardName}</option>
          </select>
          )}

          {error && <div className="error">{error}</div>}

          <div className="popup-buttons">
            {mode === 'edit' && source === 'tasks' && formData.boardId &&(
              <NavLink to={`/avito-hprimer/boards/${formData.boardId}`} state={boards[formData.boardId]}>Перейти к доске</NavLink>
            )}
            <div className=' btn-block'>
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" >
              {mode === 'edit' ? 'Обновить' : 'Создать'}
            </button>
            </div>  
          </div>
        </form>
      </div>
    </section>
  );
}

export default Popup;