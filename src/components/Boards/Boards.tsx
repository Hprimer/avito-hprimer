import React, { useEffect, useState } from 'react'
import { MyBoard } from '../../types/boards'
import './Boards.css'
import { Link, NavLink } from 'react-router-dom';


function Boards() {
  const [boards, setBoards] = useState<MyBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/boards')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const boardsData = Array.isArray(data?.data) ? data.data : [];
        setBoards(boardsData);
        setError(null);
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setError("Не удалось загрузить доски");
        setBoards([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка досок...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className='container'>
        <h1 className='boards-head'>Список проектов</h1>
        <ul className="boards-list container">
        {boards.map(board => (
            <li key={board.id} className="board-item">
            <h2>{board.name}</h2>
            <NavLink to={`/board/${board.id}`} state={{ board }}>Перейти к доске</NavLink>
            
            </li>
        ))}        
        </ul>

    </div>
  )
}

export default Boards