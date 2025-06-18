const path = require('path');

module.exports = function override(config, env) {
    // Configure path aliases directly in webpack
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    // Add path aliases for @/ imports
    config.resolve.alias['@'] = path.resolve(__dirname, '../src');
    config.resolve.alias['@/components'] = path.resolve(__dirname, '../src/components');
    config.resolve.alias['@/pages'] = path.resolve(__dirname, '../src/pages');
    config.resolve.alias['@/contexts'] = path.resolve(__dirname, '../src/contexts');
    config.resolve.alias['@/lib'] = path.resolve(__dirname, '../src/lib');
    config.resolve.alias['@/utils'] = path.resolve(__dirname, '../src/utils');

    return config;
};

// Export paths function to override default locations
module.exports.paths = function (paths, env) {
    // Tell react-app-rewired where to find your files (restore original paths)
    paths.appHtml = path.resolve(__dirname, '../src/public/index.html');
    paths.appPublic = path.resolve(__dirname, '../src/public');
    paths.appIndexJs = path.resolve(__dirname, '../src/index.js');
    paths.appSrc = path.resolve(__dirname, '../src');

    return paths;
};

