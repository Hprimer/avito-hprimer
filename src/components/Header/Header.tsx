import React from 'react'
import  {Link} from "react-router-dom"
import './Header.css'

function Header() {
  return (
    <div className='header'>
        <div className="container head-row">
            <div className="head-links">
                <Link to="/tasks">Все задачи </Link>
                <Link to="/boards">Проекты </Link>
            </div>
            <div className="create-task_btn">
                Создать задачу
            </div>
        </div>
    </div>
  )
}

export default Header