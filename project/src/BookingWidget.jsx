import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [fetchedPlace, setFetchedPlace] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            setFetchedPlace(response.data);
        });
    }, [id]);

    if (!fetchedPlace) return '';

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    // Regular expression pattern for Indian phone numbers
    const phoneRegex = /^[6-9]\d{9}$/;

    async function bookThisPlace() {
        // Input validation
        if (!checkIn || !checkOut) {
            alert("Please select both check-in and check-out dates.");
            return;
        }

        const today = new Date();
        const selectedCheckInDate = new Date(checkIn);
        const selectedCheckOutDate = new Date(checkOut);

        if (selectedCheckInDate <= today || selectedCheckOutDate <= today) {
            alert("Check-in and check-out dates cannot be today's date or in the past.");
            return;
        }

        if (selectedCheckInDate >= selectedCheckOutDate) {
            alert("Check-out date must be after the check-in date.");
            return;
        }

        if (numberOfGuests > fetchedPlace.maxGuests) {
            alert(`Maximum allowed guests for this place is ${fetchedPlace.maxGuests}.`);
            return;
        }

        if (!phone.match(phoneRegex)) {
            alert("Please enter a valid Indian phone number.");
            return;
        }
        // End of input validation

        const response = await axios.post('/bookings', {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            place: fetchedPlace._id,
            price: numberOfNights * fetchedPlace.price,
        });
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl ">
            <div className="text-2xl text-center">
                Price: Rs.{fetchedPlace.price} per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4 ">
                        <label>Check-In: </label>
                        <input type="date"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-l ">
                        <label>Check-Out: </label>
                        <input type="date"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="py-3 px-4 border-t ">
                    <label>Number of Guests: </label>
                    <input type="number"
                        value={numberOfGuests}
                        onChange={ev => setNumberOfGuests(ev.target.value)} />
                </div>
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t ">
                        <label>Your Name: </label>
                        <input type="text"
                            value={name}
                            onChange={ev => setName(ev.target.value)} placeholder="John Doe" />
                        <label>Mobile Number: </label>
                        <input type="tel"
                            value={phone}
                            onChange={ev => setPhone(ev.target.value)} />
                    </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="primary mt-4">
                Book this place
                {numberOfNights > 0 && (
                    <span> Rs.{numberOfNights * fetchedPlace.price}</span>
                )}
            </button>
        </div>
    );
}
