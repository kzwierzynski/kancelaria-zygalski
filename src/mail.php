<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('HTTP/1.1 405 Method Not Allowed');
  die();
}

function isJson($string) {
  return is_string($string) && is_object(json_decode($string)) && (json_last_error() == JSON_ERROR_NONE) ? true : false;
}

function getJsonFromBody() {
  $body = file_get_contents('php://input');
  if (!isJson($body)) {
    header('HTTP/1.1 400 Bad Request');
    die();
  }
  return json_decode($body, true);
}

function formatBody($name, $email, $body) {
  return "
<html>
<body>
  <p>Name: $name</p>
  <p>E-mail: <a href='mailto:$email'>$email</a></p>
  <p>
    <span style='white-space: pre-line'>$body</span>
  </p>
</body>
</html>
";
}

function formatConfirmationBody() {
  return "
<html>
<body>
  <p>Thank you! We’ll contact you within 48 hours!</p>
</body>
</html>
";
}

function firstEmailAddress($rawEmail) {
  $pattern = "/^[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/";
  preg_match_all($pattern, $rawEmail, $matches);
  if (count($matches) != 1 || count($matches[0]) != 1) {
    header('HTTP/1.1 400 Bad Request');
    die();
  }
  return $matches[0][0];
}

function confirmationMail($email, $subject, $message) {
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
  $headers .= 'From: "codeloop.eu" <contact@codeloop.eu>' . "\r\n";

  mail($email, $subject, $message, $headers);
}

function requestMail($name, $email, $subject, $message) {
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
  $headers .= "From: \"$name\" <$email>" . "\r\n";

  $to = 'contact@codeloop.eu';
  mail($to, $subject, $message, $headers);
}

$json = getJsonFromBody();

$name = htmlspecialchars(@$json['name']);
$email = htmlspecialchars(firstEmailAddress(@$json['email']));
$body = htmlspecialchars(@$json['body']);

$subject = 'codeloop.eu - contact form';
requestMail($name, $email, $subject, formatBody($name, $email, $body));
confirmationMail($email, $subject, formatConfirmationBody());

header('HTTP/1.1 204 No Content');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');
