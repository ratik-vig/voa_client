import Lottie from "lottie-react"
import { useEffect, useRef } from "react";
import animation from '../assets/rollercoaster.json'
import './Loader.css'

const Loader = () => {

    const lottieRef = useRef();
    
    useEffect(() => {
        if(lottieRef && lottieRef.current){
            lottieRef.current.setSpeed(2)
        }
    }, [lottieRef])

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'visible'
        }
    }, [])

    return(
        <>
            <div style={{position: 'fixed', height: '100vh', width: '100vw', backgroundColor: 'black', opacity: 0.5, zIndex: 2}}>  </div>

            <div className='loaderContainer' style={{zIndex: 9}}>
                <Lottie lottieRef={lottieRef} style={{height: 300}} animationData={animation} loop={true} />
                <h2 style={{color: '#000', textAlign: 'center', fontFamily: 'poppins', fontSize: '20px', fontWeight: 400, marginTop: -30}}>Hang on tight!</h2>
            </div>
        </> 
    )
}

export default Loader

