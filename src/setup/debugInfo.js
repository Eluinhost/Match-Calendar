import DebugMode from 'app/services/DebugMode';

function debugInfo($compileProvider, $logProvider) {
    // Whether scopes are available for tools
    $compileProvider.debugInfoEnabled(DebugMode);
    // Whether logging happens on console
    $logProvider.debugEnabled(DebugMode);
}
debugInfo.$inject = ['$compileProvider', '$logProvider'];

export default debugInfo;
