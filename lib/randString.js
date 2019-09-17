// 生成随机字符串
'use strict';
const charset = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

module.exports = function(length = 32, chars = charset) {
  const randMax = chars.length - 1;
  let ranStr = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.ceil(Math.random() * randMax);
    ranStr += randMax[idx];
  }
  return ranStr;
};
