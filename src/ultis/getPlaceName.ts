export async function getPlaceName(latitude, longitude) {
    const apiKey = 'AIzaSyC7R9XUNbveBlLbWP1oi42rqR0ZHw65Jmw'; // replace with your key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'OK') {
        const address = json.results[0].formatted_address;
        console.log('Place name:', address);
        return address;
      } else {
        console.log('Geocoding error:', json.status);
        return null;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }