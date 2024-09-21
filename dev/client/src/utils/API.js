import RadioBrowser from 'radio-browser';

export const searchRadioStations = async (query) => {
  let filter = {
    limit: 5,
    by: 'tag',         // Searching by tag, adjust as needed
    search: query  // Directly pass the search term
  }

  console.log(query);  // No need to stringify

  try {
    const radioStation = await RadioBrowser.getStations(filter);
    
    if (!radioStation || radioStation.length === 0) {
      throw new Error('No radio stations found!');
    }
    
    console.log(radioStation);
    return radioStation;

  } catch (error) {
    console.error('Process Failed to Execute!', error);
    throw error;  // Re-throw the error after logging it
  }
};
