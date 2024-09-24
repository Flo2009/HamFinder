import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user{
        _id
        username 
        email
      }
    }
  }
`;

export const SAVE_STATION = gql`
  mutation saveStation ($stationData: StationInput!) {
    saveStation(stationData: $stationData) {
      _id
      username
      savedStations {
        stationId
        name
        country
        clickcount
        image
        url
        homepage
        color
        isFavorite
      }
    }
  }
`;

export const REMOVE_STATION = gql`
  mutation removeStation ($stationId: String!) {
    removeStation(stationId: $stationId) {
      _id
      username
      savedStations {
        stationId
        name
      }
    }
  }
`;
