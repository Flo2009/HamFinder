# HamFinder
# Radio Station Search

## Description

This is a radio station search engine that allows users to search for new radio stations to listen to and maintain a list of favorite stations. Users can search for radio stations based on location or genre using a public radio station API, create accounts, log in, and save stations to their personal account for future reference. The application is built with a GraphQL API using Apollo Server.

## User Story

As a radio listener, I want to search for new radio stations to listen to so that I can keep a list of my favorite stations.

## Acceptance Criteria

- **GIVEN** a radio station search engine
  - **WHEN** I load the search engine
    - **THEN** I am presented with a menu with the options "Search for Stations" and "Login/Signup" and an input field to search for stations and a submit button.
  - **WHEN** I click on the "Search for Stations" menu option
    - **THEN** I am presented with an input field to search for stations and a submit button.
  - **WHEN** I am not logged in and enter a search term (location or genre) in the input field and click the submit button
    - **THEN** I am presented with several search results, each featuring a station’s name, frequency, genre, and a link to listen to the station online.
  - **WHEN** I click on the "Login/Signup" menu option
    - **THEN** a modal appears on the screen with a modal between the option to log in or sign up.
  - **WHEN** the click is set to "Signup"
    - **THEN** I am presented with three inputs for a username, an email address, and a password, and a signup button.
  - **WHEN** the toggle is set to "Login"
    - **THEN** I am presented with two inputs for an email address and a password and a login button.
  - **WHEN** I enter a username, valid email address and create a password and click on the signup button
    - **THEN** my user account is created, and I am logged in to the site.
  - **WHEN** I enter my account’s email address and password and click on the login button
    - **THEN** the modal closes, and I am logged in to the site.
  - **WHEN** I am logged in to the site
    - **THEN** the menu options change to "Search for Stations", an option to see my saved stations, and "Logout".
  - **WHEN** I am logged in and enter a search term in the input field and click the submit button
    - **THEN** I am presented with several search results, each featuring a station’s name, frequency, genre, and a link to listen to the station online and a button to save the station to my account.
    **WHEN**  I click on the "Select drop down Country" three option are given to me "US", "German", "Franch"
    - **THEN** I choose one of the choice and searc for a genre like country an click submit cutton the radio staion based on the country name shows on the page
  - **WHEN** I click on the "Save" button on a station
    - **THEN** that station’s information is saved to my account.
  - **WHEN** I click on the option to see my saved stations
    - **THEN** I am presented with all of the stations I have saved to my account, each featuring the station’s name, frequency, genre, and a link to listen to the station online and a button to remove a station from my account.
  - **WHEN** I click on the "Remove" button on a station
    - **THEN** that station is deleted from my saved stations list.
  - **WHEN** I click on the "Logout" button
    - **THEN** I am logged out of the site and presented with a menu with the options "Search for Stations" and "Login/Signup" and an input field to search for stations and a submit button.
     **WHEN** I click on the toggle dark mode to light  
 - **THEN** the page changes it color to light
   **WHEN** I navigated to a stripe page and able to make a payment/donate using debit/credit card 
 - **THEN** I am able to see that the payment is made with a confirmation page displayinging information about the confirmed transaction.
   **WHEN** I make a payment/donate
 - **THEN**I am able to see a confirmation of the transaction made
  **WHEN** 
- **THEN**



## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Run the application locally:
    ```bash
    npm start
    ```

## Back-End Tasks

### `auth.js`
- Update the authentication middleware to work with the GraphQL API for verifying users.

### `server.js`
- Implement Apollo Server and apply it as middleware to the Express server.

### Schemas Directory
- `index.js`: Export `typeDefs` and `resolvers`.
- `resolvers.js`: Define query and mutation functionality for the GraphQL API using Mongoose models. Use `user-controller.js` as a guide for handling user-related functionality.

### GraphQL Type Definitions (`typeDefs.js`)
Define the following types and mutations:

- **Query Type**:
  - `me`: Returns a `User` type.

- **Mutation Type**:
  - `login`: Accepts email and password as parameters; returns an `Auth` type.
  - `addUser`: Accepts username, email, and password as parameters; returns an `Auth` type.
  - `saveStation`: Accepts station name, frequency, genre, stationId, and link as parameters; returns a `User` type.
  - `removeStation`: Accepts stationId as a parameter; returns a `User` type.

### GraphQL Types

- **User**:
  - `_id`, `username`, `email`, `stationCount`, `savedStations`
- **Station**:
  - `stationId`, `name`, `frequency`, `genre`, `link`
- **Auth**:
  - `token`, `user`


## Front-End Tasks

### `queries.js`
- Create `GET_ME` query to retrieve logged-in user's data.

### `mutations.js`
- `LOGIN_USER`: Execute the login mutation.
- `ADD_USER`: Execute the addUser mutation.
- `SAVE_STATION`: Execute the  saveStation mutation.
- `REMOVE_STATION`: Execute the removeStation mutation.

### `App.jsx`
- Use Apollo Provider to wrap the app for GraphQL communication.

### `SearchStations.jsx`
- Replace API call to save stations with `useMutation()` for the `SAVE_STATION` mutation.

### `SavedStations.jsx`
- Remove `useEffect()` for setting user data and replace it with `useQuery()` to execute the `GET_ME` query.
- Replace API call to remove stations with `useMutation()` for the `REMOVE_STATION` mutation.

### `SignupForm.jsx`
- Replace `addUser()` API call with `ADD_USER` mutation.

### `LoginForm.jsx`
- Replace `loginUser()` API call with `LOGIN_USER` mutation.

## Technologies

- Public Radio Stations API
- GraphQL
- Apollo Server
- React
- MongoDB (or another database for user management)
- Node.js
- Express.js
- Authentication (JWT or similar)




## License

This project is licensed under the MIT License.