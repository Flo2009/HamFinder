import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      stationCount
      savedStations {
        stationId
        name
        country
        image
        url
        homepage
        clickcount
      }
    }
  }
`;


