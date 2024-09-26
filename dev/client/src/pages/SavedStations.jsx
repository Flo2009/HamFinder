import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_STATION } from '../utils/mutations';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeStationId } from '../utils/localStorage';
import { generateSVGPlaceholder } from '../utils/SVG';

const SavedStations = () => {
  // Apollo Client's useQuery to get user data
  const { loading, error, data } = useQuery(GET_ME, {
    context: {
      headers: {
        authorization: Auth.loggedIn() ? `Bearer ${Auth.getToken()}` : '',
      },
    },
    skip: !Auth.loggedIn(),
    
  });
  console.log(data);
  // Get dark mode from context
  const { isDarkMode } = useOutletContext(); 

  // Rename the data from the query for clarity
  let userData = data?.me || {};
  console.log(userData);
  //  if (userData.length != 0){
  //   console.log(userData);
  //   let stations = userData.savedStations;

  //   const obj={};

  //   for (let i = 0, len = stations.length; i < len; i++){
  //     obj[stations[i]['stationId']] = stations[i];
  //   }
  //     stations = new Array();

  //     for (const key in obj){
  //       stations.push(obj[key]);
  //     }

  //     console.log(stations);
      // userData.savedSations = stations;
    // }
  // Mutation to remove a station
  const [removeStation] = useMutation(REMOVE_STATION, {
    context: {
      headers: {
        authorization: Auth.loggedIn() ? `Bearer ${Auth.getToken()}` : '',
      },
    },
    // Use the `update` function to update the cache manually after the mutation
    update(cache, { data: { removeStation } }) {
      try {
        // Read the current GET_ME query from the cache
        const { me } = cache.readQuery({ query: GET_ME });

        // Write the new data to the cache, removing the deleted station
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: {
              ...me,
              savedStations: me.savedStations.filter((station) => station.stationId !== removeStation.stationId),
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  // Handle the delete station operation
  const handleDeleteStation = async (stationId) => {
    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await removeStation({
        variables: { stationId },
      });

      // Remove station's id from localStorage
      removeStationId(stationId);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle loading state
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Handle error state
  if (error) {
    console.error(error);
    return <h2>Something went wrong!</h2>;
  }

  return (
    <>
      <div className={`text-light ${isDarkMode ? 'bg-dark' : 'bg-light'} p-5`}>
        <Container fluid>
          <h1>Your Radio Stations!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedStations.length
            ? `Viewing ${userData.savedStations.length} saved ${userData.savedStations.length === 1 ? 'station' : 'stations'}:`
            : 'You have no saved stations!'}
        </h2>
        <Row>
          {userData.savedStations.map((station) => (
              <Col key={station.stationId} md="4">
                <Card className={`${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'} border-dark`}>
                  <a href={station.url}>
                    {station.image ? (
                      <Card.Img src={station.image} alt={`The cover for ${station.name}`} variant='top' /> 
                    ) : (
                      <img src={generateSVGPlaceholder(station.name, 'a71313')} alt={`Placeholder Image for ${station.name}`} className="card-img-top" style={{ width: '100%', height: 'auto' }} />
                    )}
                  </a>
                  <Card.Body>
                    <Card.Title>{station.name}</Card.Title>
                    <a href={station.homepage}>
                      <p className='small'>Homepage: {station.homepage}</p>
                    </a>
                    <Card.Text>{station.country}</Card.Text>
                    <Card.Text>Clicks:</Card.Text>
                    <Card.Text>{station.clickcount}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteStation(station.stationId)}>
                      Delete this Station!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedStations;
