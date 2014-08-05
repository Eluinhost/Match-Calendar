<?php
echo json_encode([
    'time' => (new DateTime())->format('U')
]);