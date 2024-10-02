import { useState, useEffect} from 'react';
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
  // Check if the darkMode setting exists in localStorage and if it's valid JSON
  const getInitialDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode');
    // Safely parse the darkMode value, default to false if parsing fails
    if (savedDarkMode === 'true') {
      return true;
    } else if (savedDarkMode === 'false') {
      return false;
    }
    return false; // default value
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  // Effect to apply dark mode class to body and save it to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Save the dark mode setting as a string in localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

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
