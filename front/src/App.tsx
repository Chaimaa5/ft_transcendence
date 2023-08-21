import './App.css';
import './index.css';
import Container from './component/app/index';
import Login from './component/login/index';
import Setup from './component/setup';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import TfaPage from "./component/tfa"
import Waiting from './component/modes/waiting';
import React ,{ useEffect, useState } from 'react';
import Instanse from './component/api/api';
import Cookies from 'js-cookie';
import GameOver from './component/game/gameOver';
import { socket_ } from './component/api/api';
import { TrainingApp } from './component/game/training/TrainingApp'
import	{GameApp}	from './component/game/GameApp';
import	{MultiApp}	from './component/game/MultiApp';
import { GameProvider } from './component/game/GameContext';

function App() {
  let isLogged = false
  console.log(Cookies.get("logged"))
  if(Cookies.get("logged") == "true")
    isLogged = true
  return (
     <div className="app-">
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={isLogged ? <Container /> : <Login/>} />
          <Route path="/profile/:username" element={ isLogged ? <Container /> : <Login/>} />
          <Route path="/leaderboord" element={ isLogged ? <Container /> : <Login/>} />
          <Route path='/setting' element={ isLogged ? <Container /> : <Login/>}/>
          <Route path='/tfa' element={isLogged ? <TfaPage/> : <Login/> }/>
          <Route path="/setup" element={isLogged ? <Setup /> : <Login/> } />
          <Route path="/chat/:roomId?" element={<Container />} />
		  <Route path="/training/:id" element={<TrainingApp />} />
		  <Route path="/game/:id/:mode" element={<GameProvider> <GameApp/> </GameProvider>} />
		  <Route path="/game/:mode" element={<GameProvider><MultiApp/></GameProvider>}/>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
