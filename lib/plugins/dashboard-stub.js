'use strict';

// serverless-node-next: no-op replacement for @serverless/dashboard-plugin.
//
// This fork is fully decoupled from Serverless Inc. hosted services, so the
// Serverless Dashboard plugin is not loaded. This stub keeps the plugin
// manager and variable-source wiring working without pulling in any dashboard
// or platform-client code.
//
// It intentionally provides a `param` configuration variable source so that
// `${param:...}` references produce a clear, actionable error instead of a
// crash. Dashboard-backed sources (e.g. `${output:...}`) and the
// login/logout/dashboard commands are not available in this fork.

const ServerlessError = require('../serverless-error');

const unsupported = (name) => () => {
  throw new ServerlessError(
    `The "${name}" variable source is provided by the Serverless Dashboard, which is not ` +
      'available in serverless-node-next. Remove the reference or use a supported source.',
    'DASHBOARD_NOT_SUPPORTED'
  );
};

class DashboardStubPlugin {
  constructor(serverless) {
    this.serverless = serverless;

    // Mirror the shape the core relies on (pluginManager.dashboardPlugin).
    this.configurationVariablesSources = {
      param: { resolve: unsupported('param') },
    };

    // No commands, hooks, or error handler are registered.
    this.commands = {};
    this.hooks = {};
  }
}

module.exports = DashboardStubPlugin;
