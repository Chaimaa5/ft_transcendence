import './App.css';
import './index.css';
import Container from './component/app/index';
import Login from './component/login/index';
import Button_ from './component/button/index'
import Setup from './component/setup';
import Profile from './component/profile/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leaderboord from './component/leaderboord/index';
import axios from 'axios';
import { useEffect } from 'react';
// import Chat from "./component/chat/Chat";
import Game from "./component/game/GameComponent";


function App() {
  return (
     <div className="app-">
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path={"/home"}  element={<Container />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/profile/:username" element={<Container />} />
          <Route path="/leaderboord" element={<Container />} />
          {/* <Route path="/Chat" element={<Container />} /> */}
		  <Route path="/game" element={<Container/>} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
