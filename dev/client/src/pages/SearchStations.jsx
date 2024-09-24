import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_STATION } from '../utils/mutations';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { searchRadioStations } from '../utils/API';
import { saveStationIds, getSavedStationIds } from '../utils/localStorage';
import { generateSVGPlaceholder } from '../utils/SVG';


// const [saveBook] = useMutation(SAVE_BOOK);

const SearchStations = () => {
  // create state for holding returned google api data
  const [searchedStations, setSearchedStations] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedStationIds, setSavedStationIds] = useState(getSavedStationIds());
  // State for handling errors
  const [error, setError] = useState(null); // <-- Add this line

  const [saveStation] = useMutation(SAVE_STATION);

  // Create a dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false); // <-- Dark mode state

  useEffect(() => {
    return () => saveStationIds(savedStationIds);
  }, [savedStationIds]);

  // Utility function to generate a random color
  const generateRandomColor = () => {
    return Math.floor(Math.random() * 16777215).toString(16);
  };

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      setError('Please enter a search term.');
      return false;
    }

    try {
      const query = searchInput.toLowerCase();

      console.log("Querying:", query); // <-- Log the query input
      const response = await searchRadioStations(query);
      console.log("API Response:", response); // <-- Log the API response
      
      if (!response || response.length === 0) {
        setError(`No stations found for the term: ${searchInput}`);
        return;
      }

      const stationData = response.map((station) => ({
        stationId: station.stationuuid,
        name: station.name,
        country: station.country,
        image: station.favicon || '',
        url: station.url_resolved,
        homepage:station.homepage,
        clickcount: station.clickcount,
        color: generateRandomColor(),  // <-- Add this line to assign a color
      }));

      setSearchedStations(stationData);
      setSearchInput('');
      setError (null);
    } catch (err) {
      setError('There was an error processing your search.')
      console.error(err);
    }
  };

  // create function to handle saving a station to our database
  const handleSaveStation = async (stationId) => {
    // console.log(stationId);

    // find the book in `searchedBooks` state by the matching id
    const stationToSave = searchedStations.find((station) => station.stationId === stationId);
    
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Call the SAVE_STATION mutation
       const { data } = await saveStation({
        variables: { stationData: stationToSave },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      if (!data) {
        throw new Error('Something went wrong!');
      }

      // if sation successfully saves to user's account, save station id to state
      setSavedStationIds([...savedStationIds, stationToSave.stationId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Toggle Dark Mode Button */}
      <div className="p-3">
        <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="secondary">
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>
      </div>

      {/* Main Search Section */}
      <div className={`text-light ${isDarkMode ? 'bg-dark' : 'bg-light'} p-5`}>
        <Container>
          {/* {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )} */}
          <h1>Search for Radio Stations!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for Radio Stations'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedStations.length
            ? `Viewing ${searchedStations.length} results:`
            : ''}
        </h2>
        <Row className="gy-4">
          {searchedStations.map((station) => {
            return (
              <Col md="4" key={station.stationId}>
               
                  <Card border='dark'>
                      <a href= {station.url}>
                        {station.image ? (
                          <Card.Img  src={station.image} alt={`The cover for ${station.name}`} variant='top' />
                        ) : (  
                          <Card.Img src={generateSVGPlaceholder(station.name, station.color)} alt={`Placeholder for ${station.name}`} variant='top' />
                        )}
                      </a>
                      <Card.Body>
                        <Card.Title>{station.name}</Card.Title>
                        <a href= {station.homepage}>
                          <Card.Text>Station Homepage</Card.Text>
                        </a>
                        <Card.Text>{station.country}</Card.Text>
                        <Card.Text>Clicks:</Card.Text>
                        <Card.Text>{station.clickcount}</Card.Text>
                        {Auth.loggedIn() && (
                          <Button
                            disabled={savedStationIds?.some((savedStationId) => savedStationId === station.stationId)}
                            className='btn-block btn-info'
                            onClick={() => handleSaveStation(station.stationId)}>
                            {savedStationIds?.some((savedStationId) => savedStationId === station.stationId)
                              ? 'This station has already been saved!'
                              : 'Save this Station!'}
                          </Button>
                        )}
                      </Card.Body>
                  </Card>
                
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchStations;
