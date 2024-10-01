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

export const ME_DONATION = gql`
query me {
  me{
  _id
  donated
  donationAmount
  }
}
`;
 
export const GET_TOTAL_DONATIONS = gql`
  query GetTotalDonations {
    allDonations
  }
`;
