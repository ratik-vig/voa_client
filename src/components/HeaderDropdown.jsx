import rides from '../assets/wheel-coaster.png'

const HeaderDropDown = ({ renderSmallHeader, selectedMenuItem }) => {

    const getBackgroundColor = () => {
        switch(selectedMenuItem){
            case 1: return {backgroundColor: '#FC6E38'}
            case 2: return {backgroundColor: '#B4C868'}
            case 3: return {backgroundColor: '#DB73A0'}
            case 4: return {backgroundColor: '#62C5C6'}
            case 5: return {backgroundColor: '#EFC254'}
        }
    }

    return(
        <div className={renderSmallHeader ?'dropdownContainerSmall' : 'dropdownContainer'} style={getBackgroundColor()}>
                <div style={{height: '100%', flex: 1 }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 0, borderRight: '2px solid #DB43A0', height: '10rem', padding: '0 16px', maxHeight: '7rem'}}>
                        <img src={rides} style={{width: '4rem', marginRight: '16px'}}/>
                        <h2 style={{color: '#303030', fontFamily: 'poppins', fontSize: '2rem', fontWeight: 'bold' }}>Rides</h2>
                    </div>
                </div>
                <div style={{height: '100%', flex: 2}}>

                </div>
        </div>
    )
}

export default HeaderDropDown