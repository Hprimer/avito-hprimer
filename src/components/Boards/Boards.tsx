import React, { useEffect, useState } from 'react'
import { MyBoard } from '../../types/boards'
import './Boards.css'
import { Link } from 'react-router-dom';


function Boards() {
    const [boards, setBoards] = useState<MyBoard[]>([]);
    const [loading, setLoading] = useState(true);
  
    // useEffect(() => {
    //   fetch(API_URL)
    //     .then(res => res.json())
    //     .then(data => {
    //       setBoards(Array.isArray(data) ? data : []);
    //     })
    //     .finally(() => setLoading(false));
    // }, []);
  
    const API_URL = '/api/v1/boards';
    useEffect(() => {
      fetch(API_URL)
        .then(res => {
          if (!res.ok) throw new Error("HTTP error");
          return res.json();
        })
        .then(data => {
          const boardsData = Array.isArray(data?.data) ? data.data : [];
          setBoards(boardsData);
        })
        .catch(error => {
          console.error("Fetch error:", error);
          setBoards([]);
        })
        .finally(() => setLoading(false));
    }, []);
  
    if (loading) {
      return (
        <p>Loading boards...</p>
      );
    }
  return (
    <div className='container'>
        <h1 className='boards-head'>Список проектов</h1>
        <ul className="boards-list container">
        {boards.map(board => (
            <li key={board.id} className="board-item">
            <h2>{board.name}</h2>
            {/* <p>{board.description}</p>
            <p>Tasks: {board.taskCount}</p> */}
            <Link to='/boards/id'>Перейти к доске</Link>
            </li>
        ))}
        
        </ul>

    </div>
  )
}

export default Boards