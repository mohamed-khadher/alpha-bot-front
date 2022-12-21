import {Container} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useState } from 'react';
import Functions from './components/functions/Functions';
import Settings from './components/settings/Settings';
import Scripts from './components/scripts/Scripts';
import Picker from './components/picker/Picker';


function App() {
  const [activeItem, setActiveItem] = useState("settings")
  
  return (
      <Container fluid>
        <Router>
            
            <Routes>
              <Route path="/functions" element={<Functions/>}/>
              <Route path="/settings" element={<Settings/>}/>
              <Route path="/scripts" element={<Scripts/>}/>
              <Route path="/rgb" element={<Picker/>}/>
            </Routes>
          </Router>
      </Container>
  );
}

export default App;
