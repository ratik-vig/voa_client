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
import Store from './pages/Store'
import TicketConfirm from './pages/TicketConfirm';
import StoreDetails from './pages/StoreDetails';
import StoreConfirmation from './pages/StoreConfirmation';
import ShowConfirmation from './pages/ShowConfirmation';

function App() {
  const [loading, setLoading] = useState(false)
  const [showLinks, setShowLinks] = useState([])
  const [attractionLinks, setAttractionLinks] = useState([])
  const [storeLinks, setStoreLinks] = useState([])

  const [token, setToken] = useState("")

  const getLinks = async() => {
    try{
      setLoading(true)
      const shows = await axios.get('http://localhost:3000/api/v1/shows/getShowNames')
      const atrns = await axios.get('http://localhost:3000/api/v1/attractions/getAttractionNames')
      const stores = await axios.get('http://localhost:3000/api/v1/stores/getStoreNames')
      setShowLinks(shows)
      setAttractionLinks(atrns)
      setStoreLinks(stores)
      setLoading(false)
    }catch(e){
      console.log(e)
      setLoading(false)
    }
  }

useEffect(() => {
   getLinks()
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
              storeLinks={storeLinks}
            />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setToken={setToken} />} /> 
                <Route path="/register" element={<Register /> } />
                <Route path="/bookTickets" element={<BookTickets token={token}/>} />
                <Route path="/attraction/:atrn_id" element={<Attraction setLoading={setLoading} />} />
                <Route path="/show/:show_id" element={<Show setLoading={setLoading} /> } />
                <Route path="/store/details/:store_id" element={<StoreDetails setLoading={setLoading} /> } />
                <Route path="/store/:store_id" element={<Store setLoading={setLoading} /> } />
                <Route path="/ticketConfirmation/:orderId" element={<TicketConfirm setLoading={setLoading} /> } /> 
                <Route path="/storeConfirmation/:orderId" element={<StoreConfirmation setLoading={setLoading} /> } />
                <Route path="/showConfirmation/:orderId" element={<ShowConfirmation setLoading={setLoading} /> } />
              </Routes>
          </Router>

          </div>

      </ChakraProvider>

  );
}

export default App;
