import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SAVE_STATION, REMOVE_STATION } from '../utils/mutations';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { searchRadioStations } from '../utils/API';
import { saveStationIds, getSavedStationIds } from '../utils/localStorage';
import { generateSVGPlaceholder } from '../utils/SVG';


// const [saveBook] = useMutation(SAVE_BOOK);

const SearchStations = () => {
  // create state for holding returned google api data
  const [searchedStations, setSearchedStations] = useState([]);

  // create state for holding top stations on page load
  const [topStations, setTopStations] = useState([]);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved stationId values
  const [savedStationIds, setSavedStationIds] = useState(getSavedStationIds());
  // State for handling errors
  const [error, setError] = useState(null); // <-- Add this line

  // mutations
  const [saveStation] = useMutation(SAVE_STATION);
  const [removeStation] = useMutation(REMOVE_STATION);
  const [language, setLanguage] = useState('Select Country');

  // Get dark mode from context
  const { isDarkMode } = useOutletContext(); 

  // Check if station is already saved
  const updateFavoriteStatus = (stations, savedIds) => {
    return stations.map((station) => ({
      ...station,
      isFavorite: savedIds.includes(station.stationId),
    }));
  };
  
  // Utility function to generate a random color
  const generateRandomColor = () => {
    return Math.floor(Math.random() * 16777215).toString(16);
  };

  // Fetch top stations on page load
  useEffect(() => {
    const fetchTopStations = async () => {
      try {
        // Fetch top or random stations from API
        const response = await searchRadioStations('', language); // No search query, so it fetches top stations

        if (response) {
          const stationData = response.map((station) => ({
            stationId: station.stationuuid,
            name: station.name.substring(0, 20),
            country: station.country,
            image: station.favicon || '',
            url: station.url_resolved,
            homepage: station.homepage,
            clickcount: station.clickcount,
            color: generateRandomColor(),
          }));

          // Limit to 6 stations and update favorite status
          const limitedStations = stationData.slice(0, 8);
          const updatedTopStations = updateFavoriteStatus(limitedStations, savedStationIds);
          
          setTopStations(updatedTopStations);
        }
      } catch (err) {
        console.error('Error fetching top stations:', err);
      }
    };

    fetchTopStations();
  }, [language, savedStationIds]);

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      setError('Please enter a search term.');
      return false;
    }

    try {
      const query = searchInput.toLowerCase();

      console.log("Querying:", query,); // <-- Log the query input
      const response = await searchRadioStations(query, language);
      console.log("API Response:", response); // <-- Log the API response
      
      if (!response || response.length === 0) {
        setError(`No stations found for the term: ${searchInput}`);
        return;
      }

      const stationData = response.map((station) => ({
        stationId: station.stationuuid,
        name: station.name.substring(0, 20),
        country: station.country,
        image: station.favicon || '',
        url: station.url_resolved,
        homepage:station.homepage,
        clickcount: station.clickcount,
        color: generateRandomColor(),  // <-- Add this line to assign a color
      }));
      
      const updatedStations = updateFavoriteStatus(stationData, savedStationIds)
      setSearchedStations(updatedStations);
      setSearchInput('');
      setError (null);
      setTopStations([]); // Clear top stations when search is performed
    } catch (err) {
      setError('There was an error processing your search.')
      console.error(err);
    }
  };

  // handleToggleFavorite function
  const handleToggleFavorite = async (stationId) => {
    const isFavorite = savedStationIds.includes(stationId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      if (isFavorite) {
        // Logic to remove station if it's a favorite
        const { data } = await removeStation({
          variables: { stationId }, // Pass the stationId to remove it
          context: {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        });

        if (!data) {
          throw new Error('Error removing station!');
        }

      // Update the savedStationIds in state and localStorage after removing
      const updatedSavedIds = savedStationIds.filter((id) => id !== stationId);
      setSavedStationIds(updatedSavedIds);
      saveStationIds(updatedSavedIds); // Save updated IDs to localStorage

      } else {
        // Logic to save the station if it's not a favorite
        const stationToSave = 
        searchedStations.find((station) => station.stationId === stationId) ||
        topStations.find((station) => station.stationId === stationId);

        if (!stationToSave) {
          console.error('Station not found!');
          return;
        }
        
        // Exclude `isFavorite` from `stationToSave` before sending it to the mutation
        const { isFavorite, color, ...stationDataToSave } = stationToSave;
        console.log("My station:" , stationDataToSave.stationId);

        const { data } = await saveStation({
          variables: { stationData: stationDataToSave },
          context: {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        });

        if (!data) {
          throw new Error('Something went wrong!');
        }
        console.log(data);
        // Update the savedStationIds in state and localStorage after saving
        const updatedSavedIds = [...savedStationIds, stationId];
        setSavedStationIds(updatedSavedIds);
        saveStationIds(updatedSavedIds); // Save updated IDs to localStorage
      }

      // Update the favorite status in the search results and top stations
      setSearchedStations((prevStations) =>
        prevStations.map((station) =>
          station.stationId === stationId ? { ...station, isFavorite: !isFavorite } : station
        )
      );

      setTopStations((prevStations) =>
        prevStations.map((station) =>
          station.stationId === stationId ? { ...station, isFavorite: !isFavorite } : station
        )
      );
    } catch (err) {
      console.error(err);
    }
  };
  const handleLanguage =(language) => {
    setLanguage(language)
  }

  return (
    <>      
      {/* Main Search Section */}
      <div className="main-content">
        <div id="searchFormSection" className={`text-light ${isDarkMode ? 'bg-dark' : 'bg-light'} p-5`}>
          <Container>
            <h1>Search for Radio Stations!</h1>
            <Form onSubmit={handleFormSubmit}>
              <Row>
                <Col xs={9} md={9}>
                  <div className="search-bar-container">
                    <Form.Control
                      name='searchInput'
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      type='text'
                      size='lg'
                      placeholder='Rock, Blues, Soul, Rap, etc.'
                      className="custom-search-bar"/>
                  </div>
                </Col>
                <Col xs={2} md={2} className="d-flex align-items-center">
                      {/* {2} md={2}  */}
                  {/* <div className="d-flex justify-content-start align-items-center flex-wrap"> */}
                      <div className="dropdown my-custom-dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          {language} {/* Display the selected country */}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                          <button className="dropdown-item" type="button"onClick={() =>handleLanguage("US")}>USA</button>
                          <button className="dropdown-item" type="button"onClick={() => handleLanguage("DE")}>Germany</button>
                          <button className="dropdown-item" type="button"onClick={() => handleLanguage("FR")}>France</button>
                        </div>
                      </div>
                </Col>
                <Col xs={1} md={1}>
                      <Button className='custom-submit-btn' type='submit' variant='success' size='lg'>
                        Go
                      </Button>
                  {/* </div>     */}
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
        
        {/* Top Stations Section */}
        {topStations.length > 0 && (
          <Container>
            <h2 className='pt-5'>Top Stations:</h2>
            <Row className="gy-4">
              {topStations.map((station) => (
                <Col md="3" key={station.stationId}>
                  <Card border='dark'>
                    <a href={station.url}>
                      {station.image ? (
                        <Card.Img src={station.image} alt={`The cover for ${station.name}`} variant='top' />
                      ) : (
                        <Card.Img src={generateSVGPlaceholder(station.name, station.color)} alt={`Placeholder for ${station.name}`} variant='top' />
                      )}
                    </a>
                    <Card.Body>
                      <Card.Title>{station.name}</Card.Title>
                      <a href={station.homepage}>
                        <Card.Text>Station Homepage</Card.Text>
                      </a>
                      <Card.Text>{station.country}</Card.Text>
                      <Card.Text>Clicks: {station.clickcount}</Card.Text>
                      {Auth.loggedIn() && (
                            // Flick Switch and Indicator Light Wrapper
                            <div className="flick-switch-wrapper">
                              {/* Flick Switch */}
                              <div className={`flick-switch ${station.isFavorite ? 'on' : ''}`} onClick={() => handleToggleFavorite(station.stationId)}>
                                <div className="flick-knob"></div>
                              </div>
                              {/* Indicator Light */}
                              <div className={`indicator-light ${station.isFavorite ? 'on' : ''}`}></div>
                            </div>
                          )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        )}
        
        {/* Search Results Section */}
        <Container>
          <h2 className='pt-5'>
            {searchedStations.length
              ? `Viewing ${searchedStations.length} results:`
              : ''}
          </h2>
          <Row className="gy-4">
            {searchedStations.map((station) => {
              const isFavorite = savedStationIds.includes(station.stationId);

              return (
                <Col md="2" lg ="2" key={station.stationId}>
                
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
                            // Flick Switch and Indicator Light Wrapper
                            <div className="flick-switch-wrapper">
                              {/* Flick Switch */}
                              <div className={`flick-switch ${station.isFavorite ? 'on' : ''}`} onClick={() => handleToggleFavorite(station.stationId)}>
                                <div className="flick-knob"></div>
                              </div>
                              {/* Indicator Light */}
                              <div className={`indicator-light ${station.isFavorite ? 'on' : ''}`}></div>
                            </div>
                          )}
                        </Card.Body>
                    </Card>
                  
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SearchStations;
