import { useEffect, useState } from 'react'
import { Text, Card, CardBody } from "@chakra-ui/react"
import animation from '../assets/success.json'
import Lottie from "lottie-react"
import { useParams } from "react-router-dom"
import axios from 'axios'

const TicketConfirm = () => {
    const {orderId} = useParams()
    const [orderDetails, setDetails] = useState([])
    const getDetails = async() => {
        const result = await axios.get('http://localhost:3000/api/v1/users/ticketOrderDetails', {params: {order_id: orderId}})
        console.log(result)
        setDetails(result.data)
    }

    useEffect(() => {
        getDetails()
    }, [])



    return (
        <div style={{width: '90vw', padding: 32, backgroundColor: 'white', border: '1px solid #e3e3e3', borderRadius: 10, margin: '32px auto'}}>
            <div style={{textAlign: 'center'}}>
                <Lottie style={{height: 200}} animationData={animation} loop={false} />
                <Text style={{fontFamily: 'poppins', fontSize: 20, marginTop: -10, color: '#707070'}}>Order successful</Text>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 32}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Order Id </Text>
                    <Text>{orderDetails[0]?.t_order_id}</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Ticket Id </Text>
                    <Text>{orderDetails[0]?.ticket_id}</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Order Date </Text>
                    <Text>{new Date(orderDetails[0]?.t_order_date).toUTCString()}</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Visit Date</Text>
                    <Text> {new Date(orderDetails[0]?.visit_date).toUTCString()}</Text>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>Ticket Type </Text>
                    <Text>{orderDetails[0]?.ticket_type}</Text>
                </div>
            </div>

            <Text style={{fontSize: 20, marginTop: 32, marginLeft: 128}}>Visitors</Text>
            {orderDetails.map(item => {
                return(
                    <div style={{marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '60vw', margin: '16px auto', borderBottom: '1px solid #e3e3e3', padding: '16px 32px'}}>
                
                        <div>
                            <Text>{`Visitor ID ${item.visitor_id}`}</Text>
                            <Text>{`Name ${item.visitor_fname} ${item.visitor_lname}`}</Text>
                            <Text>{`Visitor Type ${item.visitor_type}`}</Text>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                            <Text>Base Price $25.00</Text>
                            <Text>{`Discount $${Number(item.visitor_discount).toFixed(2)}`}</Text>
                            <Text>{`Total $${Number(25-item.visitor_discount).toFixed(2)}`} </Text>
                        </div>
                
                    </div>
                )
            })}
        </div>
    )
}

export default TicketConfirm