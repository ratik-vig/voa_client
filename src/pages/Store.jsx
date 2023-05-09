import {useState, useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
    Card, 
    Image, 
    Stack,
    CardBody,
    Heading,
    Text,
    CardFooter,
    Button,
    IconButton, 
    CardHeader,
    StackDivider,
    Box,
    FormControl,
    FormLabel,
    Input, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Select,
    useDisclosure
} from '@chakra-ui/react'
import {MdShoppingCart} from 'react-icons/md'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import jwt from 'jwt-decode'

const Store = ({ setLoading }) => {
    const [user, setUser] = useState("")
    const {store_id} = useParams()
    const [store, setStore] = useState()
    const [sku, setSku] = useState([])
    const [futureVisitors, setFutureVisitors] = useState([])
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cardDetails, setCardDetails] = useState({
        cardName: '',
        cardNum: '',
        expMonth: '',
        expYear: '',
        cvv: '',
        cardType: ''  
    })
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const navigate = useNavigate()

    const getStore = async() => {
        try{
            setLoading(true)
            const result = await axios.get("http://localhost:3000/api/v1/stores/getStoreById", {params: {store_id: store_id} })
            const skus = await axios.get("http://localhost:3000/api/v1/stores/getSkusById", {params: {store_id}})
            if(result.data[0]){
                setStore(result.data[0])
            }
            if(skus.data[0]){
                const obj = []
                skus.data.map(sku => {
                    obj.push({...sku, qty: 0})
                })
                setSku(obj)
                console.log(obj)
            }
        }catch(e){
            console.log(e)
        }finally{
            setLoading(false)
        }
    }

    const getFutureVisitors = async() => {
        try{
          setLoading(true)
          const result = await axios.get('http://localhost:3000/api/v1/visitors/getFutureVisitorsByUId', {params: {user_id: user} })
          if(result.data){
            setFutureVisitors(result.data)
            console.log(result.data)
          }
          console.log(result.data)
        }catch(error){
          console.log(error)
          setLoading(false)
        }
      }

    useEffect(() => {
        const token = jwt(localStorage.getItem("token")).data.userId
        setUser(token)
        getStore()
    }, [store_id])

    useEffect(() => {
        if(user){
            getFutureVisitors()
        }
    },[user])

    useEffect(() => {
        console.log(sku)
    }, [sku])

    const addToCart = (id) => {
        let obj = [...sku]
        obj.map(item => {
            if(item.sku_id === id){
                item.qty = 1
                let c = [...cart]
                c.push(item)
                setCart(c)
            }
        })
        setSku(obj)
    }

    const incrementQty = id => {
        let obj = [...sku]
        obj.map(item => {
            if(item.sku_id === id){
                item.qty++
                let c = [...cart]
                c = c.filter(i => i.sku_id !== item.sku_id)
                c.push(item)
                setCart(c)
            }
        })
        setSku(obj)
    }

    const decrementQty = id => {
        let obj = [...sku]
        obj.map(item => {
            if(item.sku_id === id){
                item.qty--
                let c = [...cart]
                c = c.filter(i => i.sku_id !== item.sku_id)
                console.log(item.qty)
                if(item.qty !== 0){
                    c.push(item)
                }
                setCart(c)
                
            }
        })
        setSku(obj)
    }

    const getCartTotal = () => {
        let res = 0
        cart.map(item => {
            res += (item.qty * item.sku_price)
        })
        setTotal(res)
    }

    useEffect(() => {
        getCartTotal()
    }, [cart])

    const handlePayDetailsChange = (event) => {
        const tmp = Object.create(cardDetails)
        tmp[event.target.name] = event.target.value
        setCardDetails(tmp)
    }

    const placeOrder = async() => {
        // const obj = 
        const obj = {
            visitorId: futureVisitors[0].visitor_id,
            payMethod: "online",
            items: JSON.stringify(cart),
            cardDetails: {
                cardName: cardDetails.cardName,
                cardNum: cardDetails.cardNum,
                expMon: cardDetails.expMonth,
                expYear: cardDetails.expYear,
                cardCVV: cardDetails.cvv,
                cardType: cardDetails.cardType
            }
        }
        console.log(obj)
        try{
            const result = await axios.post("http://localhost:3000/api/v1/stores/placeOrder", {obj})
            if(result){
                console.log(result)
                setTimeout(() => (
                    navigate(`/storeConfirmation/${result.data[0][0].ORDER_ID}`)
                ), 1000)
            }
            // if(result){
            //     console.log(result)
            // }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div style={{display: 'flex'}}>
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
                    <Button colorScheme='blue' mr={3} onClick={placeOrder}>
                    Pay
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            <div style={{width: '60%', padding: 32, height: '80vh', overflow: 'scroll', scrollbarWidth: 0}}>
                {sku.length !== 0 && sku.map(item => {
                    return(
                        <Card
                            direction={{ base: 'column', sm: 'row' }}
                            overflow='hidden'
                            variant='outline'
                            >
                            <Image
                                objectFit='cover'
                                maxW={{ base: '100%', sm: '200px' }}
                                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                                alt='Caffe Latte'
                            />

                            <Stack>
                                <CardBody>
                                <Heading size='md'>{item.sku_name}</Heading>

                                <Text py='2'>
                                    {item.sku_dscp}
                                </Text>
                                <Text py='2'>
                                    {`$${item.sku_price}`}
                                </Text>
                                </CardBody>

                                <CardFooter>
                                {item.qty === 0 ? <Button leftIcon={<MdShoppingCart />} colorScheme='orange' variant='solid' onClick={() => addToCart(item.sku_id)}>
                                    Add to cart
                                </Button> : 
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <IconButton colorScheme={'orange'} icon={<MinusIcon />} onClick={() => decrementQty(item.sku_id)} />
                                    <Text style={{padding: '8px 16px'}}>{item.qty}</Text>
                                    <IconButton colorScheme={'orange'} icon={<AddIcon />} onClick={() => incrementQty(item.sku_id)}/>
                                </div>}
                                </CardFooter>
                            </Stack>
                        </Card>
                    )
                })}
            </div>

            <div style={{width: '30%', padding: '16px 32px', height: '60vh', backgroundColor: '#fff', marginTop: 32, border: '1px solid #e3e3e3', borderRadius: 10, display: 'flex', flexDirection: 'column'}}>
                {cart.length !== 0 && <div style={{display: 'flex', alignItems: 'center', marginBottom: 16, flex: 1}}>
                    <MdShoppingCart />
                    <Text style={{fontFamily: 'poppins', fontSize: 18, marginLeft: 8}}>
                        Cart
                    </Text>
                </div>}
                
                {cart.length === 0 ? <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 5}}>
                    <Text style={{fontFamily: 'poppins', fontSize: 24, fontWeight: 'bold'}}>Cart is empty</Text>
                    </div> : 
                    <Card style={{height: '45vh', overflow: 'scroll'}} variant={'unstyled'}>
                    <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>

                       {cart.map(item => {
                            return(
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                    {item.sku_name}
                                    </Heading>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text pt='2' fontSize='sm'>
                                        {`${item.qty} x $${item.sku_price}`}
                                        </Text>
                                        <Text>${item.qty * item.sku_price}</Text>
                                    </div>
                                </Box>
                            )
                        })}
                    </Stack>

                    </CardBody>
                </Card>}
                {cart.length !== 0 && <div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={{fontWeight: 'bold'}}>Total</Text>  
                        <Text style={{fontWeight: 'bold'}}>{`$${total}`}</Text>      
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16, width: '100%', flex: 1}}>
                        <Button onClick={() => onOpen()} colorScheme={'orange'} style={{width: '100%'}}>Checkout</Button>
                    </div>
                </div>}

            </div>
        </div>
    )
}

export default Store