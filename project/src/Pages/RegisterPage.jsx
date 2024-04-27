import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    async function registerUser(ev){
        ev.preventDefault();
        // Resetting previous errors
        setPasswordError('');
        
        // Input validation
        let isValid = true;

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!password.match(passwordRegex)) {
            setPasswordError('Password must be alphanumeric and at least 6 characters long');
            isValid = false;
        }

        if (isValid) {
            try {
                await axios.post('/register', {
                    name,
                    email,
                    password,
                });
                alert('Registration Successful. Now you can Log In');
            } catch(e) {
                alert('Registration Failed. Please try again.')
            }
        }
    }

    return(
        <div className="mt-4 grow flex flex-col items-center justify-around">
            <div className="mb-8">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto border" onSubmit={registerUser}>
                    <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={ev => setName(ev.target.value)}
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email} 
                        onChange={ev => setEmail(ev.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)}
                        required
                    />
                    {passwordError && <p className="text-red-500">{passwordError}</p>}
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link to={'/login'} className="underline text-black">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
