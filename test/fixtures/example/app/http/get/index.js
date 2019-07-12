/**
 *获取操作记录
 *@author 陈昊
*/
'use strict';

module.exports = () => {
  return {
    params: {
      str: 'string',
    },
    cache: {
      getKey(ctx) {
        return ctx.path + ctx.state.params.str;
      },
    },
    compress: {
      threshold: 1024,
    },
    async controller() {
      const { str } = this.state.params;
      let s = '';
      for (let i = 0; i < 2019; i++) {
        s += str;
      }
      console.log('run !');
      this.body = s;
    },
  };
};
