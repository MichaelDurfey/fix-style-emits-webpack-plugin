# FixStyleEmitsWebpackPlugin

Plugin to fix an issue with style JS file emits when using mini-css-extract-plugin or splitting styles using splitChunks optimization feature in Webpack 4. This is an issue with both mini-css-extract-plugin and Webpack.
When CSS files are split via splitChunks plugin and mini-css-extracts-plugin an extra empty JS file is produced in the build. This file is a deferred module that is never resolved by the main module, thus Javascript and the main bundle never can execute. This plugin solves this issue by concating the empty JS file into the main bundle.
The issue is only being addressed by Webpack core team for version 5, so this plugin can hold us over until then.

### Issues:

- https://github.com/webpack/webpack/issues/7300
- https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85

# Get started

```bash
1. npm install --save-dev fix-style-emits-webpack-plugin
```

2. Add in plugin to Webpack config and make sure split chunk cacheGroup name includes the word `Styles` (case sensitive), like in the example below. Also be sure to add in main path to bundle in the options object.

```js
{
  // ...rest
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // vendor chunk logic...
        },
        appStyles: { // splits import of .../.../app.less into separate css file. Must use word `Styles` (case sensitive)
          name: 'app',
          test: /[\\/]app\.less$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
  plugins: [new FixStyleEmitsWebpackPlugin([options])];
}
```

Options:
below configuration is default
```js
{
  main: "main.js"; // path to main bundle where empty assets should be concated
}
```
