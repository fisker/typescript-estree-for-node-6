'use strict';

module.exports = {
  sourceMaps: true,
  presets: [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "debug": true,
        "corejs": 3,
        "targets": {
          "node": "4"
        }
      }
    ]
  ]
}