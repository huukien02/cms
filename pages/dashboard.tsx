import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from the backend using the session token from the cookie
    const sessionToken = Cookies.get('session_token');
    axios
      .get('http://photoproofapp.local/api/1.0/user', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      })
      .then((response) => {
        console.log(response.data); // Assuming the response contains the user data
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
      });
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>{user}</h1>
      {/* <p>Email: {user.email}</p> */}
      {/* Render other user details as needed */}
    </>
  );
}
