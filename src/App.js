import { useEffect, useRef, useState } from 'react'
import './App.css';
import Header from './components/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import Loader from './components/Loader';


function App() {
  const [loading, setLoading] = useState(false)
  
  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          {loading && <Loader />}
          <Header />
          <div style={{height: '150vh'}}>

          </div>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
