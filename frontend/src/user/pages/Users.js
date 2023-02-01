import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
    const USERS = [
        { id: 'u1', image: 'https://www.foodandwine.com/thmb/CGXpgjWOgHWv9TsqyMoLyl5cYrs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/soppressata-pizza-with-calabrian-chile-hot-honey-FT-RECIPE0422-827abb3537834dbcb6ab0bbd6efece39.jpg', name: 'Zachary', places: 5 },
    ];

    return <UsersList items={USERS} />
};

export default Users;