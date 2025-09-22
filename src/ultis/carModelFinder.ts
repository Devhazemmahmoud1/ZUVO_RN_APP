export async function decodeVIN(vin) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
  const response = await fetch(url);
  const data = await response.json();

  // Extract useful fields
  const results = data.Results.reduce((acc, item) => {
    if (item.Value) acc[item.Variable] = item.Value;
    return acc;
  }, {});

  console.log(results)

  return results;
}