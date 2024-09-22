const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    donationAmount: Float
    donated: Boolean
    stationCount: Int
    savedStations: [Station]
  }

  type Station {
    stationId: String!
    country: String
    clickcount: Int
    name: String!
    image: String
    url: String
    homepage: String
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  input StationInput{
    country:String
    clickcount: Int
    name: String!
    stationId: String!
    image: String
    url: String
    homepage: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!, donationAmount: Float, donated: Boolean): Auth
    saveStation(stationData: StationInput!): User
    removeStation(staionId: String!): User
    updateUser(donationAmount: Float, donated: Boolean): User
  }
`;

module.exports = typeDefs;
