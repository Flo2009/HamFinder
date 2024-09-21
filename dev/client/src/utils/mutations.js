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
  mutation saveBook ($stationData: StationInput!) {
    saveStation(bookStation: $stationData) {
      _id
      username
      savedStations {
        stationId
        title
        description
        image
        link
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
        title
      }
    }
  }
`;
