module.exports = function () {
  return {
    files: [
      'src/**/*.ts',
      {pattern: 'src/**/*.unit.ts', ignore: true}
    ],

    tests: [
      'src/**/*.unit.ts'
    ],

    env: {
      type: 'node'
    },

    // for ES code (not TypeScript) babel compiler should be used instead,
    // https://wallabyjs.com/docs/integration/es-next.html

    preprocessors: {
      '**/*.unit.js': file => require('babel-core').transform(
        file.content.replace('(\'assert\')', '(\'power-assert\')'),
        {
          filename: file.path,
          sourceMap: true, presets: ['babel-preset-power-assert']
        })
    },


    // This is not required for power-assert to work in wallaby,
    // it's just to make inline messages better

    setup: function () {
      var Module = require('module').Module;
      if (!Module._originalRequire) {
        const modulePrototype = Module.prototype;
        Module._originalRequire = modulePrototype.require;
        modulePrototype.require = function (filePath) {
          if (filePath === 'empower-core') {
            var originalEmpowerCore = Module._originalRequire.call(this, filePath);
            var newEmpowerCore = function () {
              var originalOnError = arguments[1].onError;
              arguments[1].onError = function (errorEvent) {
                errorEvent.originalMessage = errorEvent.error.message + '\n';
                return originalOnError.apply(this, arguments);
              };
              return originalEmpowerCore.apply(this, arguments);
            };
            newEmpowerCore.defaultOptions = originalEmpowerCore.defaultOptions;
            return newEmpowerCore;
          }
          return Module._originalRequire.call(this, filePath);
        };
      }
    }
  };
};