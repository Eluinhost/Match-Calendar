function bs3($tooltipProvider) {
    $tooltipProvider.options({
        animation: false,
        popupDelay: 400
    });
}

bs3.$inject = ['$tooltipProvider'];

export default bs3;
