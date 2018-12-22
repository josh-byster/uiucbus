function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d * 0.62137119; //to miles
}
// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

function removeColors(str) {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    var colors = [
      "Yellow",
      "Red",
      "Lavender",
      "Blue",
      "Green",
      "Orange",
      "Grey",
      "Bronze",
      "Brown",
      "Gold",
      "Ruby",
      "Teal",
      "Silver",
      "Navy",
      "Pink",
      "Raven",
      "Illini",
      "YELLOW",
      "RED",
      "LAVENDER",
      "BLUE",
      "GREEN",
      "ORANGE",
      "GREY",
      "BRONZE",
      "BROWN",
      "GOLD",
      "RUBY",
      "TEAL",
      "SILVER",
      "NAVY",
      "PINK",
      "RAVEN",
      "ILLINI"
    ];
    for (var i = 0; i < colors.length; i++) {
      str = str.split(colors[i]).join("");
    }
  }
  return str;
}
export { calcCrow, toRad, removeColors };
