import { Text } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import animation from '../assets/success.json'
import Lottie from "lottie-react"

const StoreConfirmation = () => {
    const {orderId} = useParams()
    const [orderDetails, setDetails] = useState([])

    const getOrderDetails = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/stores/getOrderDetails", {params: {order_id: orderId}})
            setDetails(result.data)
            console.log(result.data)
        }catch(error){
            console.log(error)
        }
    }

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
                    <Text style={{fontWeight: 'bold'}}>Store Name</Text>
                    <Text> {orderDetails[0]?.store_name}</Text>
                </div>
                
            </div>

            <Text style={{fontSize: 20, marginTop: 32, marginLeft: 128}}>Order Items</Text>
            {orderDetails.map(item => {
                return(
                    <div style={{marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '60vw', margin: '16px auto', borderBottom: '1px solid #e3e3e3', padding: '16px 32px'}}>
                
                        <div>
                            <Text>{`SKU Name ${item.sku_name}`}</Text>
                            <Text>{`Quantity ${item.qty}`}</Text>
                            {/* <Text>{`Name ${item.visitor_fname} ${item.visitor_lname}`}</Text>
                            <Text>{`Visitor Type ${item.visitor_type}`}</Text> */}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                            <Text>{`Amount ${item.qty} x ${Number(item.sku_price).toFixed(2)} = $${Number(item.qty * item.sku_price).toFixed(2)}`}</Text>
                        </div>
                
                    </div>
                )
            })}
            <div style={{marginLeft: 128}}>
                <Text>{`Order Total $${Number(orderDetails[0]?.order_amt).toFixed(2)}`}</Text>
            </div>
        </div>
    )
}

export default StoreConfirmation