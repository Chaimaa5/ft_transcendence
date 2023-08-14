import './App.css';
import './index.css';
import Container from './component/app/index';
import Login from './component/login/index';
import Setup from './component/setup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TfaPage from "./component/tfa"
import Waiting from './component/modes/waiting';
import { socket_ } from './component/api/api';
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
          <Route path="/game" element={<Container/>} />
         
        </Routes>
    </Router>
    </div>
  );
}

export default App;
