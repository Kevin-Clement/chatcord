import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { getAllUser } from '../../services/apiService'
import RoomList from './RoomList';
import io from 'socket.io-client';

let socket;

const Home = () => {
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);

    const ENDPOINT = 'localhost:8000';

    useEffect(() => {
        socket = io(ENDPOINT);
        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [ENDPOINT])
    useEffect(() => {
        socket.on('output-rooms', rooms => {
            setRooms(rooms)
        })

    }, [])
    useEffect(() => {
        socket.on('room-created', room => {
            setRooms([...rooms, room])
        })
    }, [rooms])
    useEffect(() => {
        console.log(rooms)
    }, [rooms])

    useEffect(() => {
        getAllUser().then((res) =>  {
            if(res.status === 200){
                setUsers(res.data)
                console.log(users);
            }
        })
        .catch((err) => console.log(err))
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        if(room !== ''){
            socket.emit('create-room', room);
            console.log(room);
            setRoom('');
        }
    }
    const userLogout = () => {
        navigate('/login')
        setUser(null);
    }

    return (
        <div>
            <h1>Bienvenue {user ? user?.username : ''}</h1>
            <form onSubmit={handleSubmit}>
                <div >
                    <div>
                        <input
                            id="room" type="text"
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                        />
                        <label htmlFor="room"> Room</label>
                    </div>
                </div>
                <br />
                <button>Créer</button>
            </form>
            <br />
            <br />
            <div>
                { rooms[0] && <h2>Listes des rooms</h2>}
                <RoomList rooms={rooms} />
            </div>
            <div>
                <h2>Listes des utilisateurs</h2>
                    {users && users.map(user => (
                        <p key={user._id} >
                            {user.username}
                        </p>
                    ))}
            </div>
            <br />
            <br />
            <button onClick={()=> userLogout()}>Deconnexion</button>
        </div>
    )
}

export default Home
