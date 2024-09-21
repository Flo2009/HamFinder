const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    stationCount: Int
    savedStations: [Station]
  }

  type Station {
    stationId: String!
    location: [String]
    description: String!
    name: String!
    image: String
    link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  input StationInput{
    location:[String]
    description: String!
   name: String!
    stationId: String!
    image: String
    link: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveStation(stationData: StationInput!): User
    removeStation(staionId: String!): User
  }
`;

module.exports = typeDefs;
