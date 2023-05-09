import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Grid, GridItem, Heading, Image, Text, Card, CardBody, CardFooter, Stack, Divider, ButtonGroup, Button} from '@chakra-ui/react'
import SimpleImageSlider from "react-simple-image-slider";

const Attraction = ({setLoading}) => {

    const {atrn_id} = useParams()
    const [atrn, setAtrn] = useState()

    const getAttraction = async() => {
        try{
            setLoading(true)
            const result = await axios.get("http://localhost:3000/api/v1/attractions/getAttractionById", {params: {atrn_id: atrn_id} })
            if(result.data[0]){
                setAtrn(result.data[0])
            }
        }catch(e){
            console.log(e)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getAttraction()
    }, [])

    useEffect(() => {
        getAttraction()
    }, [atrn_id])

    const images = [
        { url: "https://www.pgkart.com/wp-content/uploads/2020/05/010-1.jpg" },
        {url: "https://teamdays.com.au/assets/The-Bucks-Co/Land-Activity/a60eb98657/Go-karts-start__FocusFillWzc2OCw0NzQsInkiLDE5XQ.jpg"}
      ];

    return(
        <div style={{display: 'flex', padding: '16px 64px', justifyContent: 'space-evenly', marginTop: 64}} >
            <div>
                <SimpleImageSlider
                    width={1000}
                    height={504}
                    images={images}
                    showBullets={true}
                    showNavs={true}
                    autoPlay={true}
                />
                <Heading>{atrn?.atrn_name}</Heading>
                <Text> {atrn?.atrn_dscp} </Text>
            </div>

            <div >
                <Card maxW='lg' style={{width: 350, borderTop: '5px solid orange'}}>
                    <CardBody>
                        <Stack mt='6' spacing='3'>
                        <Heading size='md'>Ride Details</Heading>
                        <Text>
                            Status {atrn?.atrn_status.toUpperCase() }
                        </Text>
                        <Text>
                            Ride Type {atrn?.atrn_type }
                        </Text>
                        <Text>
                            Capacity {atrn?.atrn_cap}
                        </Text>
                        <Text>
                            Duration {atrn?.atrn_dur} minutes
                        </Text>
                        <Text>
                            Minimum Height {atrn?.atrn_min_ht} CM
                        </Text>
                        <Text>
                            Minimum Height {atrn?.atrn_min_ht} CM
                        </Text>
                        <Text>
                            Location {atrn?.atrn_lot}
                        </Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                </Card>
            </div>
        </div>
    )
  }

  export default Attraction