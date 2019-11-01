// 生成随机字符串
'use strict';
module.exports = function(length = 32, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  const randMax = chars.length - 1;
  let ranStr = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.ceil(Math.random() * randMax);
    ranStr += chars[idx];
  }
  return ranStr;
};
