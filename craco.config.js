module.exports = {
    webpack: {
      configure: {
        resolve: {
          fallback: {
            "vm": require.resolve("vm-browserify")
          }
        }
      }
    }
  };