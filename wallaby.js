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

    // for ES code (not TypeScript) babel compiler should be used
    // https://wallabyjs.com/docs/integration/es-next.html

    preprocessors: {
      '**/*.js': file => require('babel-core').transform(
        file.content,
        {
          filename: file.path,
          sourceMap: true, presets: ['babel-preset-power-assert']
        })
    },


    // This is not required for power-assert to work in wallaby,
    // it's just to make it look a bit prettier,
    // see https://github.com/power-assert-js/power-assert#customization-api

    setup: function () {

      var customPowerAssert = require('power-assert').customize({
        output: {
          renderers: [
            './built-in/assertion',
            './built-in/diagram',
            './built-in/binary-expression'
          ]
        }
      });

      var Module = require('module').Module;
      if (!Module._originalRequire) {
        const modulePrototype = Module.prototype;
        Module._originalRequire = modulePrototype.require;
        modulePrototype.require = function (filePath) {
          if (filePath === 'power-assert') return customPowerAssert;
          return Module._originalRequire.call(this, filePath);
        };
      }
    }
  };
};