import RadioBrowser from 'radio-browser';

// route to get logged in user's info (needs the token)
export const getMe = (token) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged in user
export const saveBook = (bookData, token) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId, token) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const searchRadioStations = async (query) => {
  let filter = {
    limit: 5,
    by: 'topvote',
    // searchterm: JSON.stringify(query)
  }
  console.log(JSON.stringify(query));
  RadioBrowser.getStations(filter)
    .then(data => console.log(data))
    .catch(error => console.error(error))
  // const radioStation = await RadioBrowser.getStations (filter)
  //   try{
  //     if (!radioStation) throw Error ('Radio Station not found!');
  //     console.log(radioStation);
  //     return radioStation;
      
  //   }catch(error){
  //     console.log('Process Failed to Execute!', error);
  //     throw error;
  //   }
}
// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
