import './App.css';
import './index.css';
import Container from './component/app/index';
import Login from './component/login/index';
import Setup from './component/setup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TfaPage from "./component/tfa"
import { socket_ } from './component/api/api';
import { TrainingApp } from './component/game/training/TrainingApp'
import	{GameApp}	from './component/game/GameApp';
import { GameProvider } from './component/game/GameContext';

function App() {

  return (
     <div className="app-">
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home"  element={<Container />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/profile/:username" element={<Container />} />
          <Route path="/leaderboord" element={<Container />} />
          <Route path='/setting' element={<Container/>}/>
          <Route path='/tfa' element={<TfaPage/>}/>
          <Route path='/waiting' element={<Container/>}/>
          <Route path="/chat" element={<Container />} />
          <Route path="/chat/:roomId?" element={<Container />} />
          <Route path="/training/:id" element={<TrainingApp />} />
		  <Route path="/game/:id/:mode" element={<GameProvider><GameApp/></GameProvider>} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
