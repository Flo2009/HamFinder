import React from 'react';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client'
import { SAVE_STATION } from '../utils/mutations';

import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { searchRadioStations } from '../utils/API';
import { saveStationIds, getSavedStationIds } from '../utils/localStorage';

// const [saveBook] = useMutation(SAVE_BOOK);

const SearchStations = () => {
  // create state for holding returned google api data
  const [searchedStations, setSearchedStations] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedStationIds, setSavedStationIds] = useState(getSavedStationIds());
  const [saveStation] = useMutation(SAVE_STATION);
  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveStationIds(savedStationIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchRadioStations(searchInput);
      console.log("response", response)
      
      if (!response || response.length === 0) {
        throw new Error('No stations found!');
      }

      const stationData = response.map((station) => ({
        stationId: station.stationuuid,     // Adjust the property names as per the API response
        title: station.name,                // Adjust property names as per the API response
        description: station.country,       // You can adjust this as per the station object
        image: station.favicon || '',       // This is optional if you want to display images
        url: station.url_resolved,
      }));

      setSearchedStations(stationData);
      setSearchInput('');

    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveStation = async (stationId) => {
    // find the book in `searchedBooks` state by the matching id
    const stationToSave = searchedStations.find((station) => station.bookId === stationId);
    
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Call the SAVE_BOOK mutation
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

      // if book successfully saves to user's account, save book id to state
      setSavedStationIds([...savedStationIds, stationToSave.stationId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
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
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedStations.map((station) => {
            return (
              <Col md="4" key={station.stationId}>
                <a href= {station.url}>
                  <Card border='dark'>
                    {station.image ? (
                      <Card.Img  src={station.image} alt={`The cover for ${station.title}`} variant='top' />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{station.title}</Card.Title>
                      
                      <Card.Text>{station.description}</Card.Text>
                      {Auth.loggedIn() && (
                        <Button
                          disabled={savedStationIds?.some((savedStationId) => savedStationId === station.stationId)}
                          className='btn-block btn-info'
                          onClick={() => handleSaveStation(station.stationId)}>
                          {savedStationIds?.some((savedStationId) => savedStationId === book.stationId)
                            ? 'This station has already been saved!'
                            : 'Save this Station!'}
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchStations;
