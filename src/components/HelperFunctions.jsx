function removeColors(str) {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    var colors = [
      'Yellow',
      'Red',
      'Lavender',
      'Blue',
      'Green',
      'Orange',
      'Grey',
      'Bronze',
      'Brown',
      'Gold',
      'Ruby',
      'Teal',
      'Silver',
      'Navy',
      'Pink',
      'Raven',
      'Illini',
      'YELLOW',
      'RED',
      'LAVENDER',
      'BLUE',
      'GREEN',
      'ORANGE',
      'GREY',
      'BRONZE',
      'BROWN',
      'GOLD',
      'RUBY',
      'TEAL',
      'SILVER',
      'NAVY',
      'PINK',
      'RAVEN',
      'ILLINI'
    ];
    for (var i = 0; i < colors.length; i++) {
      str = str.split(colors[i]).join('');
    }
  }
  return str;
}
export { removeColors };
