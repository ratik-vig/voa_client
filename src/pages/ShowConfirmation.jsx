import { useParams } from "react-router-dom"
import {useState, useEffect} from 'react'
import animation from '../assets/success.json'
import Lottie from "lottie-react"
import { Text } from "@chakra-ui/react"
import axios from "axios"

const ShowConfirmation = () => {
    const {orderId} = useParams()
    const [orderDetails, setDetails] = useState([])
    const [showTime, setTime] = useState([])
    const getOrderDetails = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/shows/getOrderDetails", {params: {order_id: orderId}})
            console.log(result.data)
            setDetails(result.data)
        }catch(error){
            console.log(error)
        }
    }

    const getShowTime = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/shows/getShowTime", {params: {time_id: orderDetails[0]?.time_id}})
            console.log(result.data)
            setTime(result.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if(orderDetails[0]?.time_id) getShowTime()
    },[orderDetails])

    useEffect(() => {
        getOrderDetails()
    }, [])

    return(
        <div style={{width: '90vw', padding: 32, backgroundColor: 'white', border: '1px solid #e3e3e3', borderRadius: 10, margin: '32px auto'}}>
            <div style={{textAlign: 'center'}}>
                <Lottie style={{height: 200}} animationData={animation} loop={false} />
                <Text style={{fontFamily: 'poppins', fontSize: 20, marginTop: -10, color: '#707070'}}>Order successful</Text>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 32}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Order Id </Text>
                    <Text>{orderDetails[0]?.order_id}</Text>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Order Date </Text>
                    <Text>{new Date(orderDetails[0]?.order_date).toDateString()}</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Show Date </Text>
                    <Text>{new Date(orderDetails[0]?.show_tick_date).toDateString()}</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Show Time </Text>
                    <Text>{`${new Date(showTime[0]?.start_time).toLocaleTimeString()} to ${new Date(showTime[0]?.end_time).toLocaleTimeString()}`}</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Store Name</Text>
                    <Text> {orderDetails[0]?.show_name}</Text>
                </div>
                
            </div>
        </div>

    )
}

export default ShowConfirmation