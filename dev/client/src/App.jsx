import { useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, } from '@apollo/client';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // uri: '/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  // Define dark mode state in App component
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ApolloProvider client={client}>
      <>
        {/* Pass dark mode state to Navbar */}
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        {/* Pass dark mode context via Outlet */}
        <Outlet context={{ isDarkMode, setIsDarkMode }} />
      </>
    </ApolloProvider>
  );
}

export default App;
