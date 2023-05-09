import {
    Text,
    Card,
    CardBody,
    Stack,
    Heading,
    Divider,
    FormControl,
    FormLabel, 
    Select,
    Button,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton, 
    ModalFooter,
    useDisclosure,
    IconButton
} from '@chakra-ui/react'
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleImageSlider from "react-simple-image-slider";
import jwt from 'jwt-decode'

const Show = ({setLoading}) => {
    const {show_id} = useParams()
    const [showDetails, setShowDetails] = useState([])
    const [timings, setTimings] = useState([])
    const [futureVisitors, setFutureVisitors] = useState([])
    const [visitors, setVisitors] = useState([])
    const [dates, setDates] = useState([])
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedVisitors, setSelectedVisitors] = useState([])
    const [selectedShow, setSelectedShow] = useState(0)
    const [adults, setAdults] = useState(0)
    const [child,setChild] = useState(0)
    const [senior, setSenior] = useState(0)
    const [discountValid, setDiscountValid] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef(null)
    const finalRef = useRef(null)

    const navigate = useNavigate()

    const [cardDetails, setCardDetails] = useState({
        cardName: '',
        cardNum: '',
        expMonth: '',
        expYear: '',
        cvv: '',
        cardType: 'credit'  
    })

    const images = [
        { url: "https://www.pgkart.com/wp-content/uploads/2020/05/010-1.jpg" },
        {url: "https://teamdays.com.au/assets/The-Bucks-Co/Land-Activity/a60eb98657/Go-karts-start__FocusFillWzc2OCw0NzQsInkiLDE5XQ.jpg"}
    ];


    useEffect(() => {
        console.log(selectedVisitors, 'here')
        console.log(selectedDate, 'date')
    }, [selectedVisitors])

    useEffect(() => {
        console.log('show', selectedShow)
    }, [selectedShow])

    const getShowDetails = async() => {
        try{
            const result = await axios.get('http://localhost:3000/api/v1/shows/getDetails', {params: {show_id: show_id}})

            const timings = await axios.get('http://localhost:3000/api/v1/shows/getTimings', {params: {show_id: show_id}})
            setShowDetails(result.data[0])
            setTimings(timings.data)
            setSelectedShow(timings.data[0].time_id)
        }catch(error){
            console.log(error)
        }
    }

    const getFutureVisitors = async() => {
        try{
          const userId = jwt(localStorage.getItem("token")).data.userId
          setLoading(true)
          const result = await axios.get('http://localhost:3000/api/v1/visitors/getFutureVisitorsByUId', {params: {user_id: userId} })
          if(result.data){
            const d = []
            result.data.map(item => d.push(item.visit_date))
            const set = new Set(result.data)
            setFutureVisitors([...set])
            setDates(d)
            setSelectedDate(d[0])
            setLoading(false)
          }
        }catch(error){
          console.log(error)
          setLoading(false)
        }
    }

    const getVisitors = async() => {
        try{
            const userId = jwt(localStorage.getItem("token")).data.userId
            setLoading(true)
            console.log(selectedDate)
            const result = await axios.get('http://localhost:3000/api/v1/visitors/getVisitorsByIdDate', {params: {user_id: userId, show_date: selectedDate} })
            if(result.data){
                console.log(result.data)
                setVisitors(result.data)
                setSelectedVisitors([result.data[0].visitor_id])
              setLoading(false)
           }
        }catch(error){
            console.log(error)
            setLoading(false)
        }
    }

    const checkHolidays = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/visitors/getHolidaysByDate", {params: {check_date: new Date(selectedDate)}})
            if(new Date(new Date(selectedDate).toLocaleString('en', {timeZone: 'America/New_York'})).getDay() === 0 || new Date(new Date(selectedDate).toLocaleString('en', {timeZone: 'America/New_York'})).getDay() === 6){
                console.log('weekend')
                setDiscountValid(false)
                return
            }
            if(result.data.length === 0){
                console.log('none')
                setDiscountValid(true)
            }else{
                console.log('holiday')
                setDiscountValid(false)
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        getFutureVisitors()
        getShowDetails()
    }, [show_id])

    useEffect(() => {
        if(selectedDate){
            checkHolidays()
        }
    }, [selectedDate])

    useEffect(() => {
        if(timings.length !== 0 && selectedDate !== '')
            getVisitors()
    }, [timings, selectedDate])

    const handleCheckout = () => {
        
        onOpen()
    }
    const handlePayDetailsChange = (event) => {
        const tmp = Object.create(cardDetails)
        tmp[event.target.name] = event.target.value
        setCardDetails(tmp)
    }
    const getTotal = () => {
        console.log(discountValid)
        let total = 0
        total += (adults * showDetails.show_price)
        total +=  (senior * showDetails.show_price)
        if(!discountValid) total += (child * showDetails.show_price)
        return total
    }

    const purchaseTicket = async() => {
        try{
            let obj = {
                visitor: selectedVisitors[0],
                order_date: new Date(),
                order_src: "show",
                show_date: new Date(selectedDate),
                show_time: selectedShow,
                adult: adults,
                senior: senior,
                child: child,
                payMethod: 'card',
                cardName: cardDetails.cardName,
                cardNum: cardDetails.cardNum,
                expMon: cardDetails.expMonth,
                expYear: cardDetails.expYear,
                cardCVV: cardDetails.cvv,
                cardType: cardDetails.cardType
            }
            const result = await axios.post("http://localhost:3000/api/v1/shows/buyTicket", {obj})
            if(result){
                console.log(result)
                setTimeout(() => {
                    navigate(`/showConfirmation/${result.data[0][0].ORDER_ID}`)

                }, 1000)
            }
            //     setTimeout(() => (
            //         navigate(`/showConfirmation/${result.data.orderID}`)
            //     ), 1000)
            // }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div style={{display: 'flex', padding: '16px 64px', justifyContent: 'space-evenly', marginTop: 64}} >
             <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Enter Payment Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                    <FormLabel>Card</FormLabel>
                        <Select name={'cardType'} onChange={handlePayDetailsChange}>
                            <option value={'credit'}>Credit</option>
                            <option value={'debit'}>Debit</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                    <FormLabel>Name on card</FormLabel>
                        <Input name={'cardName'} placeholder='First name' value={cardDetails.cardName} onChange={handlePayDetailsChange} />
                    </FormControl>

                    <FormControl mt={4}>
                    <FormLabel>Card Number</FormLabel>
                    <Input type={'number'} name={'cardNum'} placeholder='Card number' value={cardDetails.cardNum} onChange={handlePayDetailsChange} />
                    </FormControl>

                    <FormControl>
                    <FormLabel>Expiry Month</FormLabel>
                        <Input type={'number'} name={'expMonth'} placeholder='Exp. Month' value={cardDetails.expMonth} onChange={handlePayDetailsChange}/>
                    </FormControl>

                    <FormControl mt={4}>
                    <FormLabel>Expiry Year</FormLabel>
                    <Input type={'number'} name={'expYear'} placeholder='Exp. Year' value={cardDetails.expYear} onChange={handlePayDetailsChange}/>
                    </FormControl>

                    <FormControl mt={4}>
                    <FormLabel>CVV</FormLabel>
                    <Input type={'number'} name={'cvv'} placeholder='Enter CVV' value={cardDetails.cvv}  onChange={handlePayDetailsChange}/>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={purchaseTicket}>
                    Pay
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            <div>
                <SimpleImageSlider
                    width={1000}
                    height={504}
                    images={images}
                    showBullets={true}
                    showNavs={true}
                    autoPlay={true}
                />
                <Heading>{showDetails?.show_name}</Heading>
                <Text> {showDetails?.show_dscp} </Text>
                
            </div>

            <div >
                <Card maxW='lg' style={{width: 350, height: '70vh'}}>
                    <CardBody>
                        <Stack mt='6' spacing='3'>
                        <Heading size='md'>Book Tickets</Heading>
                        {futureVisitors.length !== 0 ? <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{flex: 6, overflow: 'scroll'}}>
                                <FormControl>
                                    <FormLabel>Select Date</FormLabel>
                                        <Select name={dates[0]} onChange={(e) => {setSelectedDate(e.target.value)}}>
                                            {dates.map(date => {
                                                return (
                                                    <option value={date}>{new Date(date).toUTCString().split(' ')[2] + ' ' + new Date(date).toUTCString().split(' ')[1] + ', '+new Date(date).toUTCString().split(' ')[3]}</option>
                                                )
                                            })}
                                            
                                        </Select>
                                </FormControl>
                                
                                    <FormControl>
                                        <FormLabel>Select Show</FormLabel>
                                            <Select name={timings[0]?.start_time} defaultValue={timings[0]} value={selectedShow} onChange={(e) => {setSelectedShow(e.target.value)}}>
                                                {timings?.map(date => {
                                                    return (
                                                        <option value={date.time_id}>{new Date(date.start_time).toUTCString().split(' ')[4]}</option>
                                                    )
                                                })}
                                                
                                            </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Adult Tickets</FormLabel>
                                        <Input placeholder='Number of adult tickets' value={adults} onChange={(e) => setAdults(e.target.value)}/>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Senior Tickets</FormLabel>
                                        <Input placeholder='Number of senior tickets' value={senior} onChange={(e) => setSenior(e.target.value)}/>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Child Tickets</FormLabel>
                                        <Input placeholder='Number of child tickets' value={child} onChange={(e) => setChild(e.target.value)}/>
                                    </FormControl>
                                    
                            </div>
                            <div style={{flex: 1, marginTop: 16}}>
                                <Text>{`Total $${getTotal()} `}</Text>
                                <Button colorScheme={'orange'} onClick={handleCheckout}>Checkout</Button>
                            </div>
                        </div> : <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Purchase amusement park ticket first</Text>
                        </div>}
                        </Stack>
                    </CardBody>
                    <Divider />
                </Card>
            </div>
        </div>
    )
}

export default Show