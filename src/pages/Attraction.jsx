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
        // <Grid
        //     h='800px'
        //     templateRows='repeat(2, 1fr)'
        //     templateColumns='repeat(2, 1fr)'
        //     gap={4}
        //     style={{padding: 64}}
        //     >
        //     <GridItem rowSpan={2} colSpan={1}>
            
            
        //     <GridItem rowSpan={2} colSpan={1}>
        //     <Card maxW='sm'>
        //         <CardBody>
        //             <Image
        //             src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
        //             alt='Green double couch with wooden legs'
        //             borderRadius='lg'
        //             />
        //             <Stack mt='6' spacing='3'>
        //             <Heading size='md'>Living room Sofa</Heading>
        //             <Text>
        //                 This sofa is perfect for modern tropical spaces, baroque inspired
        //                 spaces, earthy toned spaces and for people who love a chic design with a
        //                 sprinkle of vintage design.
        //             </Text>
        //             <Text color='blue.600' fontSize='2xl'>
        //                 $450
        //             </Text>
        //             </Stack>
        //         </CardBody>
        //         <Divider />
        //         <CardFooter>
        //             <ButtonGroup spacing='2'>
        //             <Button variant='solid' colorScheme='blue'>
        //                 Buy now
        //             </Button>
        //             <Button variant='ghost' colorScheme='blue'>
        //                 Add to cart
        //             </Button>
        //             </ButtonGroup>
        //         </CardFooter>
        //         </Card>
        //     </GridItem>
        // </Grid>
    )
  }

  export default Attraction