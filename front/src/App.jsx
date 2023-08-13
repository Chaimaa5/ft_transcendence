import './App.css';
import './index.css';
import Container from './component/app/index';
import Login from './component/login/index';
import Button_ from './component/button/index'
import Setup from './component/setup';
import Profile from './component/profile/index';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Leaderboord from './component/leaderboord/index';
// import Redirect from 'react-router-dom'
import { useEffect, useState } from 'react';
import Setting from './component/setting/index';
import TfaPage from "./component/tfa" 
import Instanse from './component/api/api';
import React from 'react';
import { socket_ } from './component/api/api';

// import MultipPlayerGame from "./component/game/MultiPlayerGame";
// import TrainingGame  from './component/game/TrainingGame';
function App() {
  socket_().then((sk) => {
    sk.connect()
  })
  return (
     <div className="app-">
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
              <Route path={"/home"}  element={<Container />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/profile/:username" element={<Container />} />
              <Route path="/leaderboord" element={<Container />} />
              <Route path="/chat" element={<Container />} />
              <Route path='/setting' element={<Container/>}/>
              <Route path='/tfa' element={<TfaPage/>}/>
              <Route path="/chat/:roomId?" element={<Container />} />

              {/* <Route path="/game" element={<MultipPlayerGame />} />
              <Route path="/training" element={<TrainingGame />} /> */}
        </Routes>
    </Router>
    </div>
  );
}

export default App;



