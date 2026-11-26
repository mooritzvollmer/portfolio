<?php
// Minimal public runtime check. No secrets, paths, profile data or external requests.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');
if (!function_exists('json_encode')) {
    header('HTTP/1.1 503 Service Unavailable');
    echo '{"ready":false,"mode":"knowledge","runtimeReady":false}';
    exit;
}
$checks = array(
    'supportedPhp' => version_compare(PHP_VERSION, '8.3.0', '>='),
    'curl' => function_exists('curl_init'),
    'json' => function_exists('json_decode'),
    'openssl' => extension_loaded('openssl'),
    'mbstring' => function_exists('mb_strlen'),
    'sessions' => function_exists('session_start'),
    'secureRandom' => function_exists('random_bytes'),
    'passwordHash' => function_exists('password_hash'),
    'fileLocking' => function_exists('flock')
);
echo json_encode(array(
    'ready' => false,
    'mode' => 'knowledge',
    'runtimeReady' => !in_array(false, $checks, true),
    'phpVersion' => PHP_VERSION,
    'checks' => $checks
));
