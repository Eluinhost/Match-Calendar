function bsTooltips($tooltipProvider) {
    $tooltipProvider.options({
        animation: false,
        popupDelay: 400
    });
}

bsTooltips.$inject = ['$tooltipProvider'];

export default bsTooltips;
