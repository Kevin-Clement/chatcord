import React from 'react';
import { Link } from 'react-router-dom';

const RoomList = ({ rooms }) => {
    return (
        <div>
            {rooms && rooms.map(room => (
                <Link to={'/chat/' + room._id + '/' + room.name} key={room._id} >
                    <p>{room.name}</p>
                </Link>
            ))}
        </div>
    )
}

export default RoomList