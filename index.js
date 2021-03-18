const { ConcatSource } = require("webpack-sources");
class FixStyleEmitsWebpackPlugin {
  constructor({ main = "main.js" } = {}) {
    this.opts = { main };
    this.toIgnore = [];
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "FixStyleEmitsWebpackPlugin",
      (compilation) => {
        compilation.hooks.optimizeChunkAssets.tap(
          "FixStyleEmitsWebpackPlugin",
          (chunks) => {
            for (const chunk of chunks) {
              if (
                chunk.chunkReason &&
                /split chunk.*(Styles)/.test(chunk.chunkReason)
              ) {
                const jsFile = chunk.files.find((f) => /\.js$/.test(f));
                chunk.files = chunk.files.filter((f) => !/\.js/.test(f));
                compilation.updateAsset(this.opts.main, (oldSource) => {
                  this.toIgnore.push(jsFile);
                  return new ConcatSource(
                    oldSource,
                    "\n\n" + compilation.getAsset(jsFile).source.source()
                  );
                });
              }
            }
          }
        );
      }
    );
    compiler.hooks.emit.tap("FixstyleEmitsWebpackPlugin", (compilation) => {
      this.toIgnore.forEach((file) => {
        delete compilation.assets[file];
        delete compilation.assets[file + ".map"];
      });
    });
  }
}

module.exports = FixStyleEmitsWebpackPlugin;
