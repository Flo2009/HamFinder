import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedStations {
        stationId
        description
        title
        image
        link
      }
    }
  }
`;


