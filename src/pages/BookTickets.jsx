import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Button, ButtonGroup, Heading, Image, Text } from "@chakra-ui/react"
import {
    Accordion, 
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    FormControl,
    FormLabel,
    Input, 
    Select,
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
import { useState, useRef, useEffect } from "react"
import axios from 'axios'
import jwt from 'jwt-decode'
import states from '../constants'
import { useNavigate } from "react-router-dom"

const BookTickets = ({token}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [visitDate, setVisitDate] = useState(new Date())
    const [user, setUser] = useState()
    const [visitors, setVisitors] = useState([{fname: '', lname: '', dob: new Date(), email: '', phone: '', addr: '', city: '', state: 'AL', zip: ''}])
    const [cardDetails, setCardDetails] = useState({
        cardName: '',
        cardNum: '',
        expMonth: '',
        expYear: '',
        cvv: '',
        cardType: 'credit'  
    })
    const [orderTotal, setOrderTotal] = useState(25.0)
    const [disabled, setDisabled] = useState(true)
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = jwt(localStorage.getItem("token")).data.userId
        setUser(token)
    }, [])

    const addVisitor = () => {
        const tmp = [...visitors]
        tmp.push({fname: '', lname: '', dob: new Date(), email: '', phone: '', addr: '', city: '', state: 'AL', zip: ''})
        setVisitors(tmp)
    }

    const handleChangeText = (e, idx) => {
        const tmp = [...visitors]
        tmp[idx][e.target.name] = e.target.value.toLowerCase()
        setVisitors(tmp)
    }

    const handlePayDetailsChange = (event) => {
        const tmp = Object.create(cardDetails)
        tmp[event.target.name] = event.target.value
        setCardDetails(tmp)
    }

    const handleVisitDateChange = (e) => {
        setVisitDate(e.target.value)
    }

    const goToPayment = () => {
        onOpen()
        console.log(visitors)
    }

    const getTicketType = () => {
        if(visitors.length === 1) return "individual"
        else return "group"
    }

    const placeTicketOrder = async() => {
        // const obj = 
        const obj = {
            userId: user,
            ticketMethod: "online",
            ticketType: getTicketType(),
            visitDate: visitDate,
            payMethod: 'card',
            cardName: cardDetails.cardName,
            cardNum: cardDetails.cardNum,
            expMon: cardDetails.expMonth,
            expYear: cardDetails.expYear,
            cardCVV: cardDetails.cvv,
            cardType: cardDetails.cardType,
            visitors: JSON.stringify(visitors)
        }
        try{
            const result = await axios.post("http://localhost:3000/api/v1/users/buyTickets", {obj})
            if(result){
                setTimeout(() => (
                    navigate(`/ticketConfirmation/${result.data.orderID}`)
                ), 1000)
            }
        }catch(error){
            console.log(error)
        }
    }

    const deleteVisitor = (event, index) => {
        event.stopPropagation()
        let tmp = [...visitors]
        tmp = tmp.filter((item, idx) => idx !== index)
        setVisitors(tmp)
    }
    
    const calculateTotal = () => {
        let total = 0
        visitors.map((visitor) => {
            let price = 25
            if(visitor.dob !== ''){
                const diff = new Date(new Date() - new Date(visitor.dob)).getFullYear() - 1970
                if(diff >= 60 || diff <= 7){
                    price *= 0.85
                }
            }
            price *= 0.95
            total += price
        })
        setOrderTotal(total)
    }

    const checkVisitorFields = () => {
        let disable = false
        visitors.map(visitor => {
            if(visitor.fname === '' || visitor.lname === '' || visitor.dob === '' || visitor.email === '' || visitor.phone === '' || visitor.addr === '' || visitor.city === '' || visitor.state === 'AL' || visitor.zip === ''){
                disable = true
                return
            }
        })
        setDisabled(disable)
    }

    useEffect(() => {
        calculateTotal()
        checkVisitorFields()
    }, [visitors])

    return(
        <div style={{display: 'flex', height: '89vh'}}>

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
                    <Button colorScheme='blue' mr={3} onClick={placeTicketOrder}>
                    Pay
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>

            <div style={{flex: 3, height: '89vh'}}>
                <Image style={{height: '100%', width: '100%'}} src="https://rccl-h.assetsadobe.com/is/image/content/dam/royal/special-mkgt/miscellaneous/carousel-amusement-park-night.jpg?$440x880$" />
            </div>
            <div style={{height: '100%', flex: 5}}>
                <div style={{width: '80%', height: '55vh', backgroundColor: 'white', borderRadius: 5, padding: 16, margin: 'auto',marginTop: 32, display: 'flex', flexDirection: 'column'}}>
                    <div style={{flex: 8, overflow: 'scroll'}}>
                    <Text style={{fontWeight: 'bold'}}>Select date for visit</Text>
                    <FormControl>
                    <Input
                        name={'dob'}
                        placeholder="Select Date of visit"
                        size="md"
                        type="date"
                        value={visitDate}
                        onChange={handleVisitDateChange}
                    />
                    </FormControl>
                    <Text style={{marginTop: 8, fontWeight: 'bold'}}>Add Visitors</Text>
                    <Accordion allowMultiple>
                        {visitors.map((visitor, idx) => (
                            <AccordionItem>
                            <h2>
                            <AccordionButton>
                                <Box as="span" flex='1' textAlign='left'>
                                    <Text style={{fontWeight: 'bold'}}>{visitor.fname === '' ? "New Visitor" : `${visitor.fname.charAt(0).toUpperCase() + visitor.fname.slice(1)} ${visitor.lname.charAt(0).toUpperCase() + visitor.lname.slice(1)}`}</Text>
                                </Box>
                                <AccordionIcon />
                                <IconButton
                                    colorScheme='red'
                                    size='sm'
                                    icon={<DeleteIcon />}
                                    onClick={(event) => deleteVisitor(event, idx)}
                                    style={{marginLeft: 32}}
                                />                            
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                            <FormControl>
                                <FormLabel>First Name</FormLabel>
                                <Input name={'fname'} type='text' placeholder="Enter first name" value={visitor.fname.charAt(0).toUpperCase() + visitor.fname.slice(1)} onChange={(e) => handleChangeText(e,idx)} />
                                <FormLabel>Last Name</FormLabel>
                                <Input name={'lname'} type='text' placeholder="Enter last name" value={visitor.lname.charAt(0).toUpperCase() + visitor.lname.slice(1)} onChange={(e) => handleChangeText(e,idx) } />
                                <FormLabel>Date of Birth</FormLabel>
                                <Input
                                    name={'dob'}
                                    placeholder="Select Date of Birth"
                                    size="md"
                                    type="date"
                                    onChange={(e) => handleChangeText(e,idx)}
                                    value={visitor.dob}
                                />
                                <FormLabel>Email</FormLabel>
                                <Input name={'email'} type='email' placeholder="Enter email" value={visitor.email} onChange={(e) => handleChangeText(e,idx)}/>
                                <FormLabel>Phone</FormLabel>
                                <Input name={'phone'} type='text' placeholder="Enter phone" value={visitor.phone} onChange={(e) => handleChangeText(e,idx)}/>
                                <FormLabel>Street Address</FormLabel>
                                <Input name={'addr'} type='text' placeholder="Enter street address" value={visitor.addr} onChange={(e) => handleChangeText(e,idx)}/>
                                <FormLabel>City</FormLabel>
                                <Input name={'city'} type='text' placeholder="Enter city" value={visitor.city} onChange={(e) => handleChangeText(e,idx)}/>
                                <FormLabel>State</FormLabel>
                                <Select placeholder='Select state' name={'state'} onChange={(e) => handleChangeText(e,idx)} defaultValue={'AL'}>
                                    {
                                        states.map(state => (
                                            <option value={state.value}>{state.name}</option>       
                                        ))
                                    }
                                    
                                </Select>
                                <FormLabel>Zip Code</FormLabel>
                                <Input name={'zip'} type='text' placeholder="Enter zip code" value={visitor.zip} onChange={(e) => handleChangeText(e,idx)}/>
                                </FormControl>
                            </AccordionPanel>
                        </AccordionItem>
                        ))}
                            
                    </Accordion>
                    </div>
                    <div style={{flex: 1, marginTop: 16}}>
                        <Button leftIcon={<AddIcon />} onClick={addVisitor} style={{marginRight: 16}}>
                            Add Visitor
                        </Button>
                        <Button onClick={goToPayment} colorScheme='blue' isDisabled={disabled}>
                            Go to payment
                        </Button>
                    </div>
                </div>
            
                <div style={{width: '80%', height: '20vh', backgroundColor: 'white', borderRadius: 5, padding: 16, margin: 'auto', marginTop: 32, overflow: 'scroll'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Order Details</Text>
                    <Text>{Number(orderTotal).toFixed(2)}</Text>
                </div>
            </div>
        </div>

    )
}

export default BookTickets