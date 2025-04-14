import React, { useState } from 'react'
import  {Link, NavLink} from "react-router-dom"
import './Header.css'
import Popup from '../Popup/Popup';

function Header() {
  const [showPopupForCreate, setShowPopupForCreate] = useState(false);

  const activeLink = 'nav-list__link--active';
  const notActiveLink = 'nav-list__link';
  
  const handleClosePopup = () => {
    setShowPopupForCreate(false);
  };  
  const handkeCreateTask = () =>{
    setShowPopupForCreate(true);
  }


  return (
    <div className='header'>
      <div className="container head-row">
        <div className="head-links">
          <NavLink to="/avito-hprimer/issues" className={({isActive}): string => (isActive ? activeLink : notActiveLink)}>Все задачи </NavLink>
          <NavLink to="/avito-hprimer/boards" className={({isActive}): string => isActive ? activeLink : notActiveLink}>Проекты </NavLink>
        </div>
        
        <div className="create-task_btn" onClick={handkeCreateTask}>
          Создать задачу
        </div>
        {showPopupForCreate && (
          <Popup
            mode="create"
            // mode='edit'
            source="header"
            // taskId={selectedTaskId}
            // boardId={board.id}
            onClose={handleClosePopup}
            // onTaskUpdate={handleTaskUpdate}
        />)}
      </div>
    </div>
  )
}

export default Header