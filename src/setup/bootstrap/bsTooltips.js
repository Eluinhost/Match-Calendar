function bsTooltips($uibTooltipProvider) {
    $uibTooltipProvider.options({
        animation: false,
        popupDelay: 400
    });
}

bsTooltips.$inject = ['$uibTooltipProvider'];

export default bsTooltips;
