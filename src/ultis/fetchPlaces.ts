export const fetchAutocompletePredictions = async (input: string) => {

    const GOOGLE_API_KEY = 'AIzaSyC7R9XUNbveBlLbWP1oi42rqR0ZHw65Jmw'

    if (!input) return [];
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${GOOGLE_API_KEY}&components=country:ae`; // you can limit country by changing components param
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'OK') {
        return json.predictions; // array of predictions
      } else {
        console.warn('Places Autocomplete error:', json.status);
        return [];
      }
    } catch (error) {
      console.error('Fetch autocomplete error:', error);
      return [];
    }
  };