<?php
/**
 * Read-only mirror: serves the live Cloudflare site under this Hostinger address.
 * Every request is fetched from ORIGIN (GET/HEAD only, fixed host — not an open proxy),
 * so updates pushed to GitHub → Cloudflare appear here automatically.
 */
define('ORIGIN', getenv('MIRROR_ORIGIN') ?: 'https://colliers-va-capability.pegasus456.workers.dev');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'HEAD') {
    http_response_code(405);
    header('Allow: GET, HEAD');
    exit;
}

// Path + query exactly as requested (e.g. /sectors/office/?for=Client).
$uri = $_SERVER['REQUEST_URI'] ?? '/';
if ($uri === '' || $uri[0] !== '/') {
    $uri = '/' . $uri;
}

$forward = ['Accept', 'Accept-Language', 'If-None-Match', 'If-Modified-Since', 'User-Agent'];
$reqHeaders = [];
foreach ($forward as $h) {
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $h));
    if (!empty($_SERVER[$key])) {
        $reqHeaders[] = $h . ': ' . $_SERVER[$key];
    }
}

$keep = ['content-type', 'cache-control', 'etag', 'last-modified', 'content-language',
         'x-content-type-options', 'referrer-policy', 'location'];
$respHeaders = [];

$ch = curl_init(ORIGIN . $uri);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_NOBODY => $method === 'HEAD',
    CURLOPT_HTTPHEADER => $reqHeaders,
    CURLOPT_ENCODING => '',          // accept gzip/br from origin, send decoded
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HEADERFUNCTION => function ($c, $line) use (&$respHeaders, $keep) {
        $parts = explode(':', $line, 2);
        if (count($parts) === 2 && in_array(strtolower(trim($parts[0])), $keep, true)) {
            $respHeaders[] = [strtolower(trim($parts[0])), trim($parts[1])];
        }
        return strlen($line);
    },
]);
$body = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($body === false || !$status) {
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'The site is temporarily unavailable. Please try again in a moment.';
    exit;
}

http_response_code($status);
foreach ($respHeaders as [$name, $value]) {
    if ($name === 'location') {
        // Keep redirects on this address (e.g. /sectors → /sectors/).
        $value = str_replace(ORIGIN, '', $value);
    }
    header($name . ': ' . $value);
}
echo $body;
