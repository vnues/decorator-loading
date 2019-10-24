export default loading = function () {
  return function (
    target,
    name,
    descriptor
  ) {
    let v;
    return {
      enumerable: true,
      configurable: true,
      get: function () {
        if (descriptor) {
          v = descriptor.value
        }
        if (typeof v === 'function') {
          return async function (this) {
            window.isLoading = true
            try {
              await v.apply(this, arguments)
            } catch (error) {
              // 做一些错误上报之类的处理 
              throw error;
            } finally {
              window.isLoading = false
            }

          }
        }
      },
      set: function (c) {
        v = c;
      }
    }
  }
}