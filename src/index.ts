export { checkTrajectory } from "./matcher.js";
export { createRecorder, injectRetryFault } from "./recorder.js";
export { renderTrace } from "./render.js";
export { TrajectoryInputError, validateEvents, validateFixture } from "./validate.js";
export type * from "./types.js";
export type { EventMeta, FaultInjectedHandler, RecorderOptions, RetryFaultOptions, TrajectoryRecorder } from "./recorder.js";
export type { RenderOptions } from "./render.js";
