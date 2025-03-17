import React from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';


const MyPolls = () => {
    const { getToken } = useAuth();

    const getMyPolls = async () => {
        const token = await getToken();
        const mypoll = await axios.get("http://localhost:8008/user/polls", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(mypoll.data)
    }

    getMyPolls()
    return (
        <div>MyPolls</div>
    )
}

export default MyPolls