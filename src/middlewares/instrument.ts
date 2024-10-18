import * as Sentry from "@sentry/node"

import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://85c8c347127dffd59509b86b6f644bea@o4508139646156800.ingest.us.sentry.io/4508139649630208",
    integrations: [
        nodeProfilingIntegration(),
    ],

    tracesSampleRate: 1.0,

    profilesSampleRate: 1.0,
});