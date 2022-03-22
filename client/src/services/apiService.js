import axios from "axios";

const apiEndPoint = 'http://localhost:8000/auth/'

export function login(data){
    console.log(data);
    console.log('login');
    console.log(apiEndPoint + 'login');
    return new Promise(
        function(resolve, reject){
            const dataSignIn = {
                "username": data.username,
                "password": data.password,
            }
            axios.post(apiEndPoint + 'login', dataSignIn,
            {
                headers:{
                    'Accept' : 'application/json'
                },
            }).then(function(res){
                console.log('login', res)
                return resolve(res)
            })
            .catch(function(err){
                console.log('login', err)
                return reject(err)
            })
        }
    )
}

export function registration(data){
    console.log(data);
    console.log('registration');
    console.log(apiEndPoint + 'users');
    return new Promise(
        function(resolve, reject){
            const dataSignUp = {
                "username": data.username,
                "password": data.password
            }
            axios.post(apiEndPoint + 'signup', dataSignUp,
            {
                headers:{
                    'Accept' : 'application/json'
                },
            }).then(function(res){
                console.log('registration', res)
                return resolve(res)
            })
            .catch(function(err){
                console.log('registration', err)
                return reject(err)
            })
        }
    )
}

export function getAllUser(){
    return new Promise(
        function(resolve, reject){
            axios.get(apiEndPoint + 'users', {
                headers:{
                    'Accept' : 'application/json'
                },
                credentials: 'include',
            })
            .then(function(res){
                return resolve(res)
            })
            .catch(function(err){
                return reject(err)
            })
        }
    )
}



