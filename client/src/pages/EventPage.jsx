import axios from "axios";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";

export default function EventPage() {
  const {id} = useParams();
  const [event, setEvent] = useState(null);

  //! Fetching the event data from server by ID ------------------------------------------
  useEffect(()=>{
    if(!id){
      return;
    }
    axios.get(`/event/${id}`).then(response => {
      setEvent(response.data)
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, [id])

  //! Copy Functionalities -----------------------------------------------
  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
    window.open(facebookShareUrl);
  };
  
if (!event) return '';
  return (
    <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 flex-grow">
     <div >
        {event.image &&(
          <img src={`${event.image}`} alt="" height="500px" width="1440px" className='rounded object-fill aspect-16:9'/>
        )}
      </div>

      <img src="../src/assets/paduru.png" alt="" className='rounded object-fill aspect-16:9'/> 
      {/* FIXME: This is a demo image after completing the create event function delete this */}

      <div className="flex justify-between mt-8 mx-2">
          <h1 className="text-3xl md:text-5xl font-extrabold">{event.title.toUpperCase()}</h1>
          <Link to={'/event/'+event._id+ '/ordersummary'}>
            <button className="primary">Book Ticket</button>  
          </Link>
      </div>
      <div className="mx-2">
          <h2 className="text-md md:text-xl font-bold mt-3 text-primarydark">{event.ticketPrice === 0? 'Free' : 'LKR. '+ event.ticketPrice}</h2>
      </div>
      <div className="mx-2 mt-5 text-md md:text-lg truncate-3-lines">
        {event.description}
      </div>
      <div className="mx-2 mt-5 text-md md:text-xl font-bold text-primarydark">
        Organized By {event.organizedBy}
        
      </div>
      <div className="mx-2 mt-5">
        <h1 className="text-md md:text-xl font-extrabold">When and Where </h1>
        <div className="sm:mx-5 lg:mx-32 mt-6 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AiFillCalendar className="w-auto h-5 text-primarydark "/>
            <div className="flex flex-col gap-1">
              
              <h1 className="text-md md:text-lg font-extrabold">Date and Time</h1>
              <div className="text-sm md:text-lg">
              Date: {event.eventDate.split("T")[0]} <br />Time: {event.eventTime}
              </div>
            </div>
            
          </div>
          <div className="">
            <div className="flex items-center gap-4">
            <MdLocationPin className="w-auto h-5 text-primarydark "/>
            <div className="flex flex-col gap-1">
              
              <h1 className="text-md md:text-lg font-extrabold">Location</h1>
              <div className="text-sm md:text-lg">
                {event.location}
              </div>
            </div>
            
          </div>
          </div>
        </div>
            
      </div>
      <div className="mx-2 mt-5 text-md md:text-xl font-extrabold">
        Share with friends
        <div className="mt-10 flex gap-5 mx-10 md:mx-32 ">
        <button onClick={handleCopyLink}>
            <FaCopy className="w-auto h-6" />
          </button>

          <button onClick={handleWhatsAppShare}>
            <FaWhatsappSquare className="w-auto h-6" />
          </button>

          <button onClick={handleFacebookShare}>
            <FaFacebook className="w-auto h-6" />
          </button>

        </div>
      </div>


    </div>
  )
}
