import { Image } from "@chakra-ui/react"

const BookTickets = () => {
    return(
        <div style={{display: 'flex', height: '85vh'}}>
            <div style={{flex: 3, height: '89vh'}}>
                <Image style={{height: '100%', width: '100%'}} src="https://rccl-h.assetsadobe.com/is/image/content/dam/royal/special-mkgt/miscellaneous/carousel-amusement-park-night.jpg?$440x880$" />
            </div>
            <div style={{height: '100%', width: '100%', flex: 5}}>
                <p>hello</p>
            </div>
        </div>

    )
}

export default BookTickets