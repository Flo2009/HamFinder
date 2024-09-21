import RadioBrowser from 'radio-browser';

export const searchRadioStations = async (query) => {
  let filter = {
    limit: 5,
    by: 'tag',
    searchterm: JSON.stringify(query)
  }
  console.log(JSON.stringify(query));
  // RadioBrowser.getStations(filter)
  //   .then(data => console.log(data))
  //   .catch(error => console.error(error))
  const radioStation = await RadioBrowser.getStations (filter)
    try{
      if (!radioStation) throw Error ('Radio Station not found!');
      console.log(radioStation);
      return radioStation;
      
    }catch(error){
      console.log('Process Failed to Execute!', error);
      throw error;
    }
}
