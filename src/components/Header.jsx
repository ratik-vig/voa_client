import React, { useState, useEffect } from 'react'
import './Header.css'
import Logo from '../assets/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import HeaderDropDown from './HeaderDropdown'
import { Button, Text, Tooltip } from '@chakra-ui/react'

const Header = ({ showLinks, attractionLinks }) => {

    const [selectedMenuItem, setSelectedMenuItem] = useState(0)
    const [renderSmallHeader, setSmallHeader] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    const handleMouseLeave = () => {
        setSmallHeader(window.scrollY > 50)
        setSelectedMenuItem(0)
    }

    const handleMouseOver = (idx) => {
        setSelectedMenuItem(idx)
    }

    const handleScroll = () => {
        console.log(selectedMenuItem)
        console.log(window.scrollY)
        if(selectedMenuItem === 0)
            setSmallHeader(window.scrollY > 50)
        
    }

    useEffect(() => {
        
        window.addEventListener('scroll', handleScroll)
        return(() => {
            window.removeEventListener('scroll', handleScroll)
        })
      }, [selectedMenuItem])

      useEffect(() => {
        console.log(location.pathname)
      }, [location.pathname])

    const mountedStyle = { animation: "inAnimation 0.15s ease-in-out" };

    const getBackgroundColor = idx => {
        switch(idx){
            case 1: return '#FC6E38'
            case 2: return '#B4C868'
            case 3: return '#DB73A0'
            case 4: return '#DB73A0'
            case 5: return '#DB73A0'
        }
    }
    const getLinkContainerStyles = (idx) => {
        const obj = {
            backgroundColor: '#FC6E38',
            height: '5rem'
        }
        return obj
    }

    const smallHeader = () => {
        return(
            <>
            <div style={{width: '100%', height: '5rem'}}></div>
            <div className='smallHeader' style={{animation: 'inAnimation 0.4s ease'}}>
                <div>
                    <img src={Logo} className={'smallLogo'} />
                </div>
                <div>
                    <ul className='menuListSmall'>
                        <li onMouseOver={() => handleMouseOver(1)} onMouseLeave={handleMouseLeave}>
                            <div className='linkContainerSmall' style={ selectedMenuItem === 1 ? getLinkContainerStyles(1) : {} }>
                                <Link className='linksSmall' to='/'>Home</Link>
                            </div>

                        </li>
                        <li onMouseOver={() => handleMouseOver(2)} onMouseLeave={handleMouseLeave}>
                            <div className='linkContainerSmall' style={selectedMenuItem === 2 ? { backgroundColor: '#B4C868' } : {}}>
                                <Link className='linksSmall' to='/'>Rides <ChevronDownIcon /></Link>
                            </div>

                            { selectedMenuItem === 2 && <HeaderDropDown renderSmallHeader={renderSmallHeader} selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} showLinks={showLinks} attractionLinks={attractionLinks} /> }
                        </li>
                        <li onMouseOver={() => handleMouseOver(3)} onMouseLeave={handleMouseLeave}>
                            <div className='linkContainerSmall' style={selectedMenuItem === 3 ? {backgroundColor: '#DB73A0' } : {}}>
                                <Link className='linksSmall' to='/'>Explore <ChevronDownIcon /></Link>
                            </div>

                            { selectedMenuItem === 3 && <HeaderDropDown renderSmallHeader={renderSmallHeader} selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} showLinks={showLinks} attractionLinks={attractionLinks}/> }
                        </li>              
                    </ul>
                </div>
            </div>
            </>
        )
    }

    return (
        (location.pathname !== '/login' &&  location.pathname !== '/register') && <>
            {!renderSmallHeader ? <div style={{animation: 'headerExpand 0.4s ease'}}><div style={{width: '100%', height: '7rem'}}></div><div className='header' style={{animation: 'headerExpand 0.4s ease'}}>
                
                <div className='menuLeftContainer'>
                    <ul className='menuList'>
                        <li onMouseOver={() => handleMouseOver(1)} onMouseLeave={handleMouseLeave}>
                            <div className='linkContainer' style={selectedMenuItem === 1 ? { backgroundColor: '#FC6E38' } : {}}>
                                <Link className='links' to='/'>Home</Link>
                            </div>

                        </li>
                        <li onMouseOver={() => handleMouseOver(2)} onMouseLeave={handleMouseLeave}>
                            <div className='linkContainer' style={selectedMenuItem === 2 ? { backgroundColor: '#B4C868' } : {}}>
                                <Link className='links' to='/'>Rides <ChevronDownIcon /></Link>
                            </div>

                            { selectedMenuItem === 2 && <HeaderDropDown renderSmallHeader={renderSmallHeader} selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} showLinks={showLinks} attractionLinks={attractionLinks} /> }
                        </li>
                        <li onMouseOver={() => handleMouseOver(3)} onMouseLeave={handleMouseLeave}>
                            <div className='linkContainer' style={selectedMenuItem === 3 ? {backgroundColor: '#DB73A0' } : {}}>
                                <Link className='links' to='/'>Shows <ChevronDownIcon /></Link>
                            </div>

                            { selectedMenuItem === 3 && <HeaderDropDown renderSmallHeader={renderSmallHeader} selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} showLinks={showLinks} attractionLinks={attractionLinks}/> }
                        </li>              
                    </ul>
                </div>
                <div className='logoContainer'>
                    <img src={Logo} className={'logo'} />
                </div>
                <div className='menuRightContainer'>
                    <ul className='menuList'>
                        <li onMouseOver={() => handleMouseOver(4)} onMouseLeave={handleMouseLeave}>
                            <div className='linkContainer' style={selectedMenuItem === 4 ? {backgroundColor: '#62C5C6' } : {}}>
                                <Link className='links' to='/'>Info {selectedMenuItem === 4 ? <ChevronUpIcon /> : <ChevronDownIcon />}</Link>
                            </div>

                            { selectedMenuItem === 4 && <HeaderDropDown renderSmallHeader={renderSmallHeader} selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} showLinks={showLinks} attractionLinks={attractionLinks}/> }
                        </li>  
                        <li>
                        <Tooltip label={localStorage.getItem("token") ? "" : "You must be logged in to book tickets"}>
                            <div className='linkContainer'  onClick={() => localStorage.getItem("token") && navigate("/bookTickets")}>
                                <Text className='links'>Book Tickets </Text>
                                
                            </div>
                        </Tooltip>

                            {/* { selectedMenuItem === 5 && <HeaderDropDown renderSmallHeader={renderSmallHeader} selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} showLinks={showLinks} attractionLinks={attractionLinks}/> } */}

                        </li> 
                        <li style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Button>Login</Button>
                        </li>  
                    </ul>
                </div>
            </div> </div>: smallHeader()}
        </>
    )
}

export default Header