import React, { useState, useContext } from 'react'
import { UserContext } from '../../UserContext';
import { registration } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [inputs, setInputs] = useState({});

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const signUp = (e) => {
        e.preventDefault();
        let data = {
            username: inputs.username,
            password: inputs.password
        }
        console.log(data);
        registration(data).then(
            (res) => {
                if (res.status === 201) {
                    navigate('/login')
                }
            }
        ).catch((err) => {
            if (err.response.status === 401) {
                console.log(err);
            }
        })

    }

    if (user) {
        return () => navigate('/')
    }

    return (
        <>
            <h3>Inscription</h3>
            <br />
            <br />
            <form onSubmit={e => signUp(e)}>
                <label htmlFor="username">Pseudonyme </label>
                <input
                    required
                    type="text"
                    name="username"
                    onInput={handleChange} />
                <br />
                <br />
                <label htmlFor="password">Mot de passe </label>
                <input
                    required
                    type="password"
                    name="password"
                    onInput={handleChange} />
                <br />
                <br />
                <button type="submit">S'inscrire</button>
            </form>
            <br />
            <br />
            <p>Déjà un compte ?<span className='btn' onClick={() => navigate("/login")}> Se connecter</span> </p>
        </>
        

    )
}

export default Signup
