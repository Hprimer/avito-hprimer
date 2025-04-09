import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Boards from './components/Boards/Boards';
import Header from './components/Header/Header';


function App() {

  return (
    <div className="App ">
      <BrowserRouter>
        <Header/>

        <Routes>
          <Route path='/boards' element={<Boards/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;