import { useEffect, useRef } from 'react'
import './App.css';
import Header from './components/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'


function App() {

  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <Header />
          <div style={{height: '150vh'}}>

          </div>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
