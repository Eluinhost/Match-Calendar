// This needs to run before bootstrap because NG_ENABLE_DEBUG_INFO is stripped during bootstrap
const forcedDebug = /^NG_ENABLE_DEBUG_INFO!/.test(window.name);
// The comment is stripped out when minified making this true
const isMinified = !/COMMENT/.test(() => {/** COMMENT */});

const AppDebugInfoEnabled = forcedDebug || !isMinified;

export default AppDebugInfoEnabled;

export { forcedDebug, isMinified, AppDebugInfoEnabled };
