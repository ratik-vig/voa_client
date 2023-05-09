import {useEffect, useState} from 'react'
import jwt from 'jwt-decode'
import axios from 'axios'
import { Text,Card,CardBody } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
    // const [,] = 
    const [storeOrders, setStoreOrders] = useState([])
    const [showOrders, setShowOrders] = useState([])
    const [ticketOrders, setTicketOrders] = useState([])
    const [user, setUser] = useState("")
    const navigate = useNavigate()
    const getStoreOrders = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/stores/getOrdersByUId", {params: {user_id: user}})
            console.log(result.data)
            setStoreOrders(result.data)
        }catch(err){
            console.log(err)
        }
    }

    const getShowOrders = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/shows/getOrdersByUId", {params: {user_id: user}})
            console.log(result.data)
            setShowOrders(result.data)
        }catch(err){
            console.log(err)
        }
    }

    const getTicketOrders = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/users/getOrdersByUId", {params: {user_id: user}})
            console.log(result.data)
            setTicketOrders(result.data)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/')
        }
        setUser(jwt(localStorage.getItem("token")).data.userId)
        
    }, [])

    useEffect(() => {
        if(user){
            getStoreOrders()
            getShowOrders()
            getTicketOrders()
        }
    }, [user])

    return(
        <div style={{display: 'flex', flexDirection: 'column', width: '60vw', justifyContent: 'center', margin: '32px auto'}}>
            {storeOrders.map(item => {
                return(
                    <Card onClick={() => navigate(`/storeConfirmation/${item.order_id}`)} style={{marginTop: 16, cursor: 'pointer'}}>
                        <CardBody>
                            <Text>{`Order ID ${item.order_id}`}</Text>
                            <Text>{`Type Store`}</Text>
                        </CardBody>
                    </Card>
                )
            })}
            {showOrders.map(item => {
                return(
                    <Card onClick={() => navigate(`/showConfirmation/${item.order_id}`)} style={{marginTop: 16, cursor: 'pointer'}}>
                        <CardBody>
                            <Text>{`Order ID ${item.order_id}`}</Text>
                            <Text>{`Type Show`}</Text>
                        </CardBody>
                    </Card>
                )
            })}
            {ticketOrders.map(item => {
                return(
                    <Card onClick={() => navigate(`/ticketConfirmation/${item.t_order_id}`)} style={{marginTop: 16, cursor: 'pointer'}}>
                        <CardBody>
                            <Text>{`Order ID ${item.t_order_id}`}</Text>
                            <Text>{`Type Ticket`}</Text>
                        </CardBody>
                    </Card>
                )
            })}
        </div>
    )
}

export default Orders