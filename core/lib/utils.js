

module.exports = {

  /**
   * NEXTORIGIN
   * ==========
   * var next_origin = nextorigin();
   */
  nextorigin: (function() {
    var max = 20
      ,   ori = Math.floor(Math.random() * max);
    return function( origin, failover ) {
      return origin.indexOf('pubsub.') > 0
        && origin.replace(
          'pubsub', 'ps' + (
            failover ? generate_uuid().split('-')[0] :
              (++ori < max? ori : ori=1)
          ) ) || origin;
    }
  })()

};