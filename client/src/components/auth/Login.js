import React, { useState, useContext } from 'react'
import { UserContext } from '../../UserContext';
import { login } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const signIn = (e) => {
        e.preventDefault();
        let data = {
            username: inputs.username,
            password: inputs.password
        }
        console.log(data);
        login(data).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setUser(res.data);
                    navigate('/')
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
            <h3>Connexion</h3>
            <br />
            <br />
            <form onSubmit={e => signIn(e)}>
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
                <button type="submit">Connexion</button>
            </form>
            <br />
            <br />
            <p>Pas encore de compte ? <span className='btn' onClick={() => navigate("/signup")}> S'incrire</span> </p>
        </>
        

    )
}

export default Login
