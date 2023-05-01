import { useEffect, useRef, useState } from 'react'
import './App.css';
import Header from './components/Header';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams
} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import axios from 'axios'

import Loader from './components/Loader';
import Home from './pages/Home'
import Attraction from './pages/Attraction'
import Show from './pages/Show';
import Login from './pages/Login';
import Register from './pages/Register';
import BookTickets from './pages/BookTickets';

function App() {
  const [loading, setLoading] = useState(false)
  const [showLinks, setShowLinks] = useState([])
  const [attractionLinks, setAttractionLinks] = useState([])
  const [token, setToken] = useState("")

  const getLinks = async() => {
    try{
      setLoading(true)
      const shows = await axios.get('http://localhost:3000/api/v1/shows/getShowNames')
      const atrns = await axios.get('http://localhost:3000/api/v1/attractions/getAttractionNames')
      setShowLinks(shows)
      setAttractionLinks(atrns)
      setLoading(false)
    }catch(e){
      console.log(e)
      setLoading(false)
    }
  }

useEffect(() => {
   getLinks()
   console.log('hello')
}, [])

useEffect(() => {
  console.log(token)
}, [token])

  return (
      <ChakraProvider>
          <div>
          <Router>

            {loading && <Loader />}
            <Header 
              showLinks={showLinks}
              attractionLinks={attractionLinks}
            />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setToken={setToken} />} /> 
                <Route path="/register" element={<Register /> } />
                <Route path="/bookTickets" element={<BookTickets />} />
                <Route path="attraction/:atrn_id" element={<Attraction setLoading={setLoading} />} />
                <Route path="show/:show_id" element={<Show setLoading={setLoading} /> } />
              </Routes>
          </Router>

          </div>

      </ChakraProvider>

  );
}

export default App;
