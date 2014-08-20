<?php
header('Content-type: application/json');
echo json_encode([
    'time' => microtime(true) * 1000
]);