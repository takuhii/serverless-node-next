'use strict';

const configUtils = require('@serverless/utils/config');

// serverless-node-next: telemetry is DISABLED BY DEFAULT.
// This fork does not send usage analytics to any hosted service.
// Telemetry only runs if a user explicitly opts in via the
// SLS_TELEMETRY_ENABLED env var (or SLS_TRACKING_ENABLED), and even
// then the existing disable switches still take precedence.
const isExplicitlyDisabled = Boolean(
  process.env.SLS_TELEMETRY_DISABLED ||
    process.env.SLS_TRACKING_DISABLED ||
    configUtils.get('trackingDisabled')
);

const isExplicitlyEnabled = Boolean(
  process.env.SLS_TELEMETRY_ENABLED || process.env.SLS_TRACKING_ENABLED
);

module.exports = isExplicitlyDisabled || !isExplicitlyEnabled;
