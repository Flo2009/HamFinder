# HamFinder
# Radio Station Search

## Description

This is a radio station search engine that allows users to search for new radio stations to listen to and maintain a list of favorite stations. Users can search for radio stations based on location or genre using a public radio station API, create accounts, log in, and save stations to their personal account for future reference. Users can donate and the total donated amount is also shown. The application is built with a GraphQL API using Apollo Server.

## Table of Contents

- [UserStory](#userstory)
- [AcceptanceCriteria](#acceptancecriteria)
- [Installation](#installation)
- [BackEndTasks](#backendtasks)
- [FrontEndTasks](#frontendtasks)
- [Technologies](#technologies)
- [Credits](#credits)
- [License](#license)
- [Badges](#badges)
- [Links](#links)
- [Contact](#contact)


## UserStory

As a radio listener, I want to search for new radio stations to listen to so that I can keep a list of my favorite stations.

## AcceptanceCriteria

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
 - **THEN** I am able to see that the payment is made with a confirmation displayinging information about the confirmed transaction.
   **WHEN** I make a payment/donate
 - **THEN** my contrbutions show in the Naviagation Bar 
  **WHEN** I start the app
- **THEN** I see the total donations contributed by all signed-up users

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url](https://github.com/Flo2009/HamFinder.git>
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Run the application locally from the `dev` folder:
    ```bash
    npm run develop
    ```

## BackEndTasks

### `auth.js`
- Update the authentication middleware to work with the GraphQL API for verifying users.

### `server.js`
- Implement Apollo Server and apply it as middleware to the Express server.

### SchemasDirectory
- `index.js`: Export `typeDefs` and `resolvers`.
- `resolvers.js`: Define query and mutation functionality for the GraphQL API using Mongoose models. Use `user-controller.js` as a guide for handling user-related functionality.

### GraphQlTypeDefinitions (`typeDefs.js`)
Define the following types and mutations:

- **Query Type**:
  - `me`: Returns a `User` type with user and station information.
  - `allDonations`: Returns all donations over all signed up users. 

- **Mutation Type**:
  - `login`: Accepts email and password as parameters; returns an `Auth` type.
  - `addUser`: Accepts username, email, and password as parameters; returns an `Auth` type.
  - `saveStation`: Accepts station name, frequency, genre, stationId, and link as parameters; returns a `User` type.
  - `removeStation`: Accepts stationId as a parameter; returns a `User` type.
  - `createPaymentIntent`: Returns the `PaymentIntentResponse` for Sripe.
  - `updateUserDonation`: Accepts the donation amount as a parameter; returns a `User` type.

### GraphQlTypes

- **User**:
  - `_id`, `username`, `email`, `stationCount`, `savedStations`
- **Station**:
  - `stationId`, `name`, `frequency`, `genre`, `link`
- **Auth**:
  - `token`, `user`


## FrontEndTasks

### `queries.js`
- Create `GET_ME` query to retrieve logged-in user's data.
- Create `ME_DONATION` query to retrieve the donation data of the user.
- Create `GET_TOTAL_DONATIONS` query to retrieve the donations from all signed up users.

### `mutations.js`
- `LOGIN_USER`: Execute the login mutation.
- `ADD_USER`: Execute the addUser mutation.
- `SAVE_STATION`: Execute the  saveStation mutation.
- `REMOVE_STATION`: Execute the removeStation mutation.
- `CREATE_PAYMENT_INTENT`: Generate Payment Intent for Stripe.
- `UPDATE_USER_DONATION`: Update the user donations.

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

Screen Shot:
![Screenshot 2024-09-25 at 8 47 42 PM](https://github.com/user-attachments/assets/f834da76-918c-4fe4-9070-72e7af8a3867)

![Screenshot 2024-09-25 at 8 49 20 PM](https://github.com/user-attachments/assets/913da1dd-e6cf-4158-a09e-ad9686836f61)

![Screenshot 2024-09-25 at 8 50 39 PM](https://github.com/user-attachments/assets/06e6fa96-b712-4320-a7ef-2655bd55dd6d)

Dark Mode
![Screenshot 2024-09-25 at 8 51 59 PM](https://github.com/user-attachments/assets/81457c69-42ec-4c16-8b3f-64319bb3096b)
Login
![Screenshot 2024-09-25 at 8 53 46 PM](https://github.com/user-attachments/assets/dab178a0-f03f-4ea5-9f7b-03f304f8af7a)
SignUp 

![Screenshot 2024-09-25 at 8 54 03 PM](https://github.com/user-attachments/assets/dcf1a4e5-bc1f-4be2-ac6a-e4b0e5ee9116)
Saved Favourite Radio Station by user
![Screenshot 2024-09-25 at 9 01 46 PM](https://github.com/user-attachments/assets/b7b3d999-37d2-4ed2-8bdf-7ccb71ee9505)

## Credits

https://stackoverflow.com<br>
https://developer.mozilla.org<br>

## License

https://opensource.org/license/mit

## Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Links

Deployed application is available under this link:

https://hamfinder.onrender.com/

GitHub Link

https://github.com/Flo2009/HamFinder

## Contact

Flo2009

https://github/Flo2009

supersuse81@gmail.com