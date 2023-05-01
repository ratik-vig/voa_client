import {useState} from 'react'
import { Heading, Image, Text } from "@chakra-ui/react"
import logo from '../assets/logo.png'
import {
    FormControl,
    FormLabel,
    Input,
    Button
} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = ({setToken}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleChange = (e) => {
        if(e.target.name === "email") setEmail(e.target.value)
        else if (e.target.name === 'password') setPassword(e.target.value)
    }

    const handleLogin = async() => {
        try{
            const data = {email, password}
            console.log(data)
            const result = await axios.post('http://localhost:3000/api/v1/users/login', data)
            if(result.data){
                localStorage.setItem("token", result.data)
                setToken(result.data)
                navigate("/")
            }
        }catch(err){
            console.log(err.response.data.error)
        }
       
    }

    return(
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', background: `radial-gradient(circle at 10% 20%, rgb(228, 118, 0) 0%, rgb(247, 189, 2) 90%)` }}>
            <Heading style={{color: '#f3f3f3', fontFamily: 'poppins'}}>
                Welcome Back !
            </Heading>
            <Text style={{color: '#f3f3f3', fontFamily: 'poppins', fontWeight: 'bold', marginBottom: 32}}>
                Login to continue
            </Text>
            <div style={{width: '50%', padding: '64px 32px', borderRadius: 5, boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`, backgroundColor: '#fff'}}>
                <Image src={logo} style={{width: '40%', marginBottom: 32, webkitTransform: `translateX(60%)`, transform: 'translateX(60%)'}} />
                <FormControl isRequired style={{width: '50%', webkitTransform: `translateX(40%)`, transform: 'translateX(40%)'}}>
                    <FormLabel>Email</FormLabel>
                    <Input name={"email"} placeholder='Email Address' value={email} onChange={handleChange} />

                    <FormLabel style={{marginTop: 16}}>Password</FormLabel>
                    <Input name={"password"} placeholder='Password' type={"password"} value={password} onChange={handleChange} />

                    <Button colorScheme='orange' style={{width: '100%', marginTop: 16}} onClick={handleLogin}>Login</Button>

                </FormControl>
            </div>
        </div>
    )
}

export default Login