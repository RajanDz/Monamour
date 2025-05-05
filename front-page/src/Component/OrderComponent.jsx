import { useState } from 'react'
import '../Styles/Order.css'
import { useUser } from './UserProvider'
export const OrderComponent = () => {
    const {user} = useUser();

    return (
        <div>
            <h5>Test</h5>
        </div>
    )
}