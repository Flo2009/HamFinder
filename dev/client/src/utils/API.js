export const searchRadioStations = async (query, language) => {
  const baseURL = 'https://de1.api.radio-browser.info/json/stations/search';
  
  // Define filter as an object
  // If no query is provided (e.g., for fetching top stations), adjust the filter
  let filter = {};
  if (query) {
    filter = {
      name: query,
      tag: query,
      countrycode: language, // search by country      
    };
  } else {
    // Fetch top stations by click count or any other logic for top stations
    filter = {
      order: 'clickcount', // Fetch top stations by click count
      reverse: true, // Highest click count first
      limit: 8,
    };
  }

  // Construct the URL with query parameters using URLSearchParams
  const params = new URLSearchParams(filter).toString();
  const url = `${baseURL}?${params}`;

  console.log("Query Parameters:", params);
  console.log("Constructed URL:", url);

  try {
    // Fetch the data from the Radio Browser API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch radio stations');
    }

    const radioStations = await response.json();
    
    if (!radioStations || radioStations.length === 0) {
      throw new Error('No radio stations found!');
    }

    console.log(radioStations);
    return radioStations;

  } catch (error) {
    console.error('Process Failed to Execute!', error);
    throw error;
  }
};
