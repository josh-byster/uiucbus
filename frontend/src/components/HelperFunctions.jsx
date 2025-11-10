function removeColors(str) {
  let newStr = str;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    const colors = [
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
      'ILLINI',
    ];
    for (let i = 0; i < colors.length; i++) {
      newStr = newStr.split(colors[i]).join('');
    }
  }
  return newStr;
}
export default removeColors;
