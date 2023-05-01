import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import rides from '../assets/wheel-coaster.png'
import axios from 'axios'
import {Text} from '@chakra-ui/react'

const HeaderDropDown = ({ renderSmallHeader, selectedMenuItem, setSelectedMenuItem, showLinks, attractionLinks }) => {

    const navigate = useNavigate()

    const getBackgroundColor = () => {
        switch(selectedMenuItem){
            case 1: return {backgroundColor: '#FC6E38'}
            case 2: return {backgroundColor: '#B4C868'}
            case 3: return {backgroundColor: '#DB73A0'}
            case 4: return {backgroundColor: '#62C5C6'}
            case 5: return {backgroundColor: '#EFC254'}
        }
    }

    const getLinks = () => {
        switch(selectedMenuItem){
            case 2: {
                const alinks = attractionLinks.data.map(item => item)
                console.log(alinks)
                return alinks
            }
            case 3: {
                const slinks = showLinks.data.map(item => item)
                return slinks
            }
            default: return []
        }
    }

    useEffect(() => {
        console.log(attractionLinks)
    }, [])

    const getName = (item) => {
        if(selectedMenuItem === 2) return item.atrn_name
        if(selectedMenuItem === 3) return item.show_name
    }

    const navigateToLink = (item) => {
        if(selectedMenuItem === 2) {
            navigate(`/attraction/${item.atrn_id}`)
            setSelectedMenuItem(0)
        }
        else if(selectedMenuItem === 3){
            navigate(`/show/${item.show_id}`)
            setSelectedMenuItem(0)
        }
    }

    return(
        <div className={renderSmallHeader ?'dropdownContainerSmall' : 'dropdownContainer'} style={getBackgroundColor()}>
                <div style={{height: '100%', flex: 1 }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 0, borderRight: '2px solid #9CB056', height: '10rem', padding: '0 16px', maxHeight: '7rem'}}>
                        <img src={rides} style={{width: '4rem', marginRight: '16px'}}/>
                        <h2 style={{color: '#303030', fontFamily: 'poppins', fontSize: '2rem', fontWeight: 'bold' }}>Rides</h2>
                    </div>
                </div>
                <div style={{height: '100%', flex: 2}}>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                            {getLinks().map((item, idx) => {
                                if(idx < 5)
                                return <Text onClick={() => navigateToLink(item)} style={{cursor: 'pointer'}}>{getName(item)}</Text>
                                // return <Link to={`/attraction/${item.atrn_id}`} style={{fontFamily: 'poppins'}}>{getName(item)}</Link>
                            })}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                            {getLinks().map((item, idx) => {
                                if(idx>=5 && idx < 10)
                                return <Text onClick={() => navigateToLink(item)} style={{cursor: 'pointer'}}>{getName(item)}</Text>
                                // return <Link to="/attraction" style={{fontFamily: 'poppins'}}>{getName(item)}</Link>
                            })}
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default HeaderDropDown