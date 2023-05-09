import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Grid, GridItem, Heading, Image, Text, Card, CardBody, CardFooter, Stack, Divider, ButtonGroup, Button} from '@chakra-ui/react'
import SimpleImageSlider from "react-simple-image-slider";
import jwt from 'jwt-decode'

const StoreDetails = ({setLoading}) => {
    const images = [
        { url: "https://www.pgkart.com/wp-content/uploads/2020/05/010-1.jpg" },
        {url: "https://teamdays.com.au/assets/The-Bucks-Co/Land-Activity/a60eb98657/Go-karts-start__FocusFillWzc2OCw0NzQsInkiLDE5XQ.jpg"}
    ];

    const [details, setDetails] = useState([])
    const [futureVisitors, setFutureVisitors] = useState([])
    const [token, setToken] = useState(null)
    const [disable, setDisable] = useState(true)
    const navigate = useNavigate()
    const {store_id} = useParams()

    const getStoreDetails = async() => {
        try{
            const result = await axios.get('http://localhost:3000/api/v1/stores/getStoreById', {params: {store_id: store_id}})
            setDetails(result.data[0])
            console.log(result.data[0])
        }catch(error){
            console.log(error)
        }
    }

    const getUserToken = () => {
        let t = localStorage.getItem("token")
        if(t){
            t = jwt(t).data
            setToken(t)

        }
        console.log(t)
    } 

    useEffect(() => {
        getUserToken()
        getStoreDetails()
    }, [store_id])

    const formatDate = (date) => {
        const hours = date.getUTCHours()
        const minutes = date.getUTCMinutes()
        return `${hours > 12 ? hours-12 : hours} ${minutes == 0 ? '' : `:` + minutes} ${hours>=12 ? `PM` : `AM` }`
    }

    const navigateToSKU = () => {
        navigate(`/store/${store_id}`)
    }

    const checkIfVisitorExists = () => {
        futureVisitors.map(item => {
            if(new Date(item.visit_date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]){
                setDisable(false)
            }
        })
    }

    const getFutureVisitors = async() => {
        try{
          setLoading(true)
          const result = await axios.get('http://localhost:3000/api/v1/visitors/getFutureVisitorsByUId', {params: {user_id: token.userId} })
          if(result.data){
            setFutureVisitors(result.data)
            console.log(result.data)
          }
          console.log(result.data)
          setLoading(false)
        }catch(error){
          console.log(error)
          setLoading(false)
        }
      }

      useEffect(() => {
        if(token){
            getFutureVisitors()
        }
      }, [token])

      useEffect(() => {
        if(futureVisitors){
            checkIfVisitorExists()
        }
      }, [futureVisitors])

    return(
        <div style={{display: 'flex', padding: '16px 64px', justifyContent: 'space-evenly', marginTop: 64}} >
        <div>
            {images.length !== 0 && <SimpleImageSlider
                width={'40vw'}
                height={504}
                images={images}
                showBullets={true}
                showNavs={true}
                autoPlay={true}
            />}
            <Heading>{details.store_name}</Heading>
            <Text> {details.store_dscp} </Text>
        </div>

        <div >
            <Card maxW='lg' style={{width: '40vw'}}>
                <CardBody>
                    <Stack mt='6' spacing='3'>
                    <Heading size='md'>Store Details</Heading>
                    <Text>{`Opening Time ${formatDate(new Date(details.store_open_time))}`}</Text>
                    <Text>{`Closing Time ${formatDate(new Date(details.store_close_time))}`}</Text>

                    <Button isDisabled={disable} onClick={navigateToSKU} colorScheme={'orange'}>BUY ITEMS</Button>
                    </Stack>
                </CardBody>
                <Divider />
            </Card>
        </div>
    </div>
    )
}

export default StoreDetails