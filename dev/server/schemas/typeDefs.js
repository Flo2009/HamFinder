const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    donationAmount: [Int]
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
    color: String
    isFavorite: Boolean
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type PaymentIntentResponse {
    clientSecret: String!
  }

  input StationInput{
    country:String
    clickcount: Int
    name: String!
    stationId: String!
    image: String
    url: String
    homepage: String
    color: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!, donationAmount: Float, donated: Boolean): Auth
    saveStation(stationData: StationInput!): User
    removeStation(stationId: String!): User
    createPaymentIntent(amount: Int!): PaymentIntentResponse!
    updateUserDonation(amount: Int!): User!
  }
`;

module.exports = typeDefs;
