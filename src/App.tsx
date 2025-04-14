import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Boards from './components/Boards/Boards';
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import Tasks from './components/Tasks/Tasks';


function App() {

  return (
    <div className="App ">
      <BrowserRouter>
        <Header/>

        <Routes>
          <Route path='/avito-hprimer' element={<Navigate to="/avito-hprimer/boards"/>}/>
          <Route path='/avito-hprimer/boards' element={<Boards/>}/>
          <Route path='/avito-hprimer/boards/:id' element={<Board/>}/>
          <Route path='/avito-hprimer/issues' element={<Tasks/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;