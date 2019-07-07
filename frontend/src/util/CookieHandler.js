import { Cookies } from 'react-cookie';

const cookies = new Cookies();

function getRecentStops() {
  return cookies.get('stops') !== undefined ? cookies.get('stops') : [];
}

function appendRecentStop(object) {
  const arr = getRecentStops();
  const index = arr.map(x => x.id).indexOf(object.id);
  if (index !== -1) {
    arr.splice(index, 1); // remove duplicates in array
  }
  arr.unshift(object); // add at beginning
  cookies.set('stops', arr.slice(0, 5)); // set only first 5 elements
}

function clearAllRecents() {
  cookies.set('stops', []);
}

export { appendRecentStop, getRecentStops, clearAllRecents };
