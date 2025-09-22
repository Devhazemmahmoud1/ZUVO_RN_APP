export const fetchPlaceDetails = async (placeId: string) => {
    const GOOGLE_API_KEY = 'AIzaSyC7R9XUNbveBlLbWP1oi42rqR0ZHw65Jmw';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'OK') {
        return json.result;
      }
      console.warn('Place details error:', json.status);
      return null;
    } catch (e) {
      console.error('Place details fetch error', e);
      return null;
    }
};