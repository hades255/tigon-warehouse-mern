import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { useSelector } from '../redux/store';

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const user = useSelector(state => state.auth.user);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome, {user.name}!</p>
      <button onClick={authContext.logout}>Logout</button>
    </div>
  );
};

export default HomePage;
