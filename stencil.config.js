exports.config = {
  namespace: 'stencil-pdfjs',
  generateDistribution: true,
  serviceWorker: false
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
