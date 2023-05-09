import { Text, Card, Image, Stack, CardBody, Heading, CardFooter, Button } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

const Home = () => {

  const [atrns, setAtrn] = useState([])
  const [shows, setShows] = useState([])
  const [stores, setStores] = useState([])
  const navigate = useNavigate()

  const getTopAttractions = async() => {
    try{
      const result = await axios.get("http://localhost:3000/api/v1/attractions/getTopAttractions")
      console.log(result)
      setAtrn(result.data)
    }catch(err){
      console.log(err)
    }
  }

  const getTopShows = async() => {
    try{
      const result = await axios.get("http://localhost:3000/api/v1/shows/getTopShows")
      setShows(result.data)
    }catch(err){
      console.log(err)
    }
  }
  const getTopStores = async() => {
    try{
      const result = await axios.get("http://localhost:3000/api/v1/stores/getTopStores")
      setStores(result.data)
      console.log(result.data)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getTopAttractions()
    getTopShows()
    getTopStores()
  }, [])

    return(
      <div style={{ display: 'flex', flexDirection: 'column', padding: 32}}>
        <div>
          <Text style={{fontSize: 32}}>Attractions</Text>
          <div style={{display: 'flex'}}>
            {atrns.map(item => {
              return(
                <Card
                style={{ width: '20vw', marginLeft: 32, cursor: 'pointer' }}
                overflow='hidden'
                variant='outline'
                onClick={() => navigate(`/attraction/${item.atrn_id}`)}
              >
                <Image
                  objectFit='cover'
                  // maxW={{ base: '100%', sm: '200px' }}
                  src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                  alt='Caffe Latte'
                  style={{width: '20vw'}}
                />
  
                <Stack>
                  <CardBody>
                    <Heading size='md'>{item.atrn_name}</Heading>
  
                    <Text py='2'>
                     {item.atrn_dscp}
                    </Text>
                  </CardBody>
  
                </Stack>
              </Card>
              )
            })}

          </div>
        </div>

        <div>
          <Text style={{fontSize: 32}}>Shows</Text>
          <div style={{display: 'flex'}}>
            {shows.map(item => {
              return(
                <Card
                style={{ width: '20vw', marginLeft: 32, cursor: 'pointer' }}
                overflow='hidden'
                variant='outline'
                onClick={() => navigate(`/show/${item.show_id}`)}
              >
                <Image
                  objectFit='cover'
                  // maxW={{ base: '100%', sm: '200px' }}
                  src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                  alt='Caffe Latte'
                  fallbackSrc='https://via.placeholder.com/150'
                  style={{width: '20vw'}}
                />
  
                <Stack>
                  <CardBody>
                    <Heading size='md'>{item.show_name}</Heading>
  
                    <Text py='2'>
                     {item.show_dscp}
                    </Text>
                  </CardBody>
  
                </Stack>
              </Card>
              )
            })}
            
          </div>
        </div>


        <div>
          <Text style={{fontSize: 32}}>Stores</Text>
          <div style={{display: 'flex'}}>
            {stores.map(item => {
              return(
                <Card
                style={{ width: '20vw', marginLeft: 32, cursor: 'pointer' }}
                overflow='hidden'
                variant='outline'
                onClick={() => navigate(`/store/details/${item.store_id}`)}
              >
                <Image
                  objectFit='cover'
                  // maxW={{ base: '100%', sm: '200px' }}
                  src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                  alt='Caffe Latte'
                  fallbackSrc='https://via.placeholder.com/150'
                  style={{width: '20vw'}}
                />
  
                <Stack>
                  <CardBody>
                    <Heading size='md'>{item.store_name}</Heading>
  
                    <Text py='2'>
                     {item.store_dscp}
                    </Text>
                  </CardBody>
  
                </Stack>
              </Card>
              )
            })}
            
          </div>
        </div>
      </div>
    )
  }

  export default Home