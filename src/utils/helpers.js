export const formatLocationName = (location) => {
  return location.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getNextLocation = (currentLocation, availableLocations) => {
  const currentIndex = availableLocations.indexOf(currentLocation);
  return currentIndex < availableLocations.length - 1 
    ? availableLocations[currentIndex + 1] 
    : availableLocations[0];
};