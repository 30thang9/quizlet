/**
 * OpenTelemetry Instrumentation
 * 
 * This file sets up OpenTelemetry tracing for the Next.js application.
 * Uncomment and configure the sections below to enable tracing.
 */

// Server-side instrumentation
// export async function register() {
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     // Node.js server instrumentation
//     const { NodeSDK } = await import('@opentelemetry/sdk-node');
//     const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
//     const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
//     const { Resource } = await import('@opentelemetry/resources');
//     const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');
// 
//     const sdk = new NodeSDK({
//       resource: new Resource({
//         [SemanticResourceAttributes.SERVICE_NAME]: 'quizlet-web',
//         [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
//         [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
//       }),
//       traceExporter: new OTLPTraceExporter({
//         url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
//       }),
//       instrumentations: [
//         getNodeAutoInstrumentations({
//           '@opentelemetry/instrumentation-fs': { enabled: false },
//         }),
//       ],
//     });
// 
//     sdk.start();
//     process.on('SIGTERM', () => {
//       sdk.shutdown()
//         .then(() => console.log('Tracing terminated'))
//         .catch((error) => console.log('Error terminating tracing', error))
//         .finally(() => process.exit(0));
//     });
//   }
// }

// Edge runtime instrumentation
// export const onRequest = async ({ request }: { request: Request }) => {
//   const tracer = trace.getTracer('quizlet-web');
//   
//   return tracer.startActiveSpan('handle request', (span) => {
//     span.setAttribute('http.method', request.method);
//     span.setAttribute('http.url', request.url);
//     
//     try {
//       // Your request handling logic here
//       return { status: 200 };
//     } catch (error) {
//       span.recordException(error as Error);
//       throw error;
//     } finally {
//       span.end();
//     }
//   });
// };
