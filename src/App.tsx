import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
          <Route path='/boards' element={<Boards/>}/>
          <Route path='/board/:id' element={<Board/>}/>
          <Route path='/issues' element={<Tasks/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;