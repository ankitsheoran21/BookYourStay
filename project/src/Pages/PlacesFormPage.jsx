import { useEffect, useState } from "react";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";

export default function PlacesFormPage(){
    const {id}= useParams();
    const [title, setTitle]= useState('');
    const [address, setAddress]= useState('');
    const [addedPhotos, setAddedPhotos]= useState([]);
    const [photoLink, setPhotoLink]= useState('');
    const [description, setDescription]= useState('');
    const [perks, setPerks]= useState([]);
    const [extraInfo, setExtraInfo]= useState('');
    const [checkIn, setCheckIn]= useState('');
    const [checkOut, setCheckOut]= useState('');
    const [maxGuests, setMaxGuests]= useState(1);
    const [price, setPrice]= useState(100);
    const [redirect, setRedirect]= useState(false);

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/places/'+id).then(response =>{
            const {data}= response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        })
    }, [id]);

    function inputHeader(text){
        return(
            <h2 className="text-xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header, description){
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function addPhotoByLink(ev){
        ev.preventDefault();
        const {data:filename}= await axios.post('/upload-by-link', {link: photoLink});
        onChange(prev => {
            return [...prev,filename];
        });
        setPhotoLink('');
    }

    function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for(let i=0; i<files.length; i++){
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
            const {data:filenames}= response;
            onChange(prev => {
                return [...prev, ...filenames];
            });
        })
    }

    async function savePlace(ev){
        ev.preventDefault();
        const placeData = {title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests,price,
          };
        if(id){
            //update
            await axios.put('/places', {id, ...placeData
              });
            setRedirect(true);
        }else{
            //new place
            await axios.post('/places', placeData);
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/account/places'} />
    }

    return(
        <div>
            <AccountNav />
        <form onSubmit={savePlace}>
                    {preInput('Title','Title for your place')}
                    <input required type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example:My lovely apartment" />
                    {preInput('Address','Address to this place')}
                    <input required type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
                    {preInput('Photos','The more the better')}
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                    {preInput('Description','About this place')}
                    <textarea required value={description} onChange={ev => setDescription(ev.target.value)}/>
                    {preInput('Amenities','Select all the perks of your place')}
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks}/>
                    </div>
                    {preInput('Extra Info','Additional information about the place')}
                    <textarea required value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>
                    {preInput('Check In, Check Out Time and Max number of Guests','Add Check In time, Check Out time and remember to leave a window for cleaning between Check Out and Check In time')}
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                        <div>
                            <h3 className="mt-2 -mb-1">Check In Time</h3>
                            <input type="text"
                                required 
                                value={checkIn} 
                                onChange={ev => setCheckIn(ev.target.value)} 
                                placeholder="14:00"/>
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Check Out Time</h3>
                            <input type="text" 
                                required
                                value={checkOut} 
                                onChange={ev => setCheckOut(ev.target.value)} 
                                placeholder="11:00"/>
                        </div>
                        <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                            <input type="number" 
                                required
                                value={maxGuests} 
                                onChange={ev => setMaxGuests(ev.target.value)} />
                        </div>
                        <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                            <input type="number" 
                                required
                                value={price} 
                                onChange={ev => setPrice(ev.target.value)} />
                        </div>
                    </div>
                    <button className="primary my-4">Save</button>
                </form>
                </div>
    );
}