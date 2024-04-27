import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(){
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [redirect, setRedirect]= useState(false);
    const { setUser } = useContext(UserContext);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    async function handleLoginSubmit(ev){
        ev.preventDefault();
        // Resetting previous errors
        setEmailError('');
        setPasswordError('');
        
        // Input validation
        let isValid = true;
        if (!email || !email.includes('@')) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        }
        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            isValid = false;
        }

        if (isValid) {
            try {
                const data = await axios.post('/login', { email, password });
                setUser(data);  
                alert('Login Successful');
                setRedirect(true);
            } catch(e) {
                alert('Login Failed. Please try again');
            }
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return(
        <div className="mt-4 grow flex flex-col items-center justify-around">
            <div className="mb-8">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto border" onSubmit={handleLoginSubmit}>
                    <input 
                        type="email" 
                        placeholder="your@email.com"
                        name="email_field" 
                        value={email} 
                        onChange={ev => setEmail(ev.target.value)} 
                    />
                    {emailError && <p className="text-red-500">{emailError}</p>}
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)}
                    />
                    {passwordError && <p className="text-red-500">{passwordError}</p>}
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? 
                        <Link to={'/register'} className="underline text-black">Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
