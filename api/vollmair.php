<?php
declare(strict_types=1);
ini_set('display_errors','0'); header('Cache-Control: no-store');header('X-Robots-Tag: noindex, nofollow');header('X-Content-Type-Options: nosniff');header('Referrer-Policy: same-origin');
require __DIR__.'/vollmair-core.php';
try{
$method=$_SERVER['REQUEST_METHOD']??'GET';$action=$_GET['action']??'status';if(!is_string($action))vm_reply(['error'=>'Ungültige Aktion.'],400);
$origin=$_SERVER['HTTP_ORIGIN']??'';$expected=(PHP_SAPI==='cli-server'&&getenv('VOLLMAIR_TEST_ORIGIN'))?getenv('VOLLMAIR_TEST_ORIGIN'):'https://moritzvollmer.de';
if(($origin!==''&&$origin!==$expected)||($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site'||($method==='POST'&&$origin!==$expected))vm_reply(['error'=>'Anfrage nicht erlaubt.'],403);
if($method==='GET'&&$action==='status'){$auth=vm_authenticated();$ready=$auth&&vm_internal_ready(vm_config());vm_reply(['ready'=>$ready,'mode'=>$ready?'ai':'knowledge','internal'=>$auth,'publicEnabled'=>VM_PUBLIC_ENABLED,'csrf'=>$auth?$_SESSION['csrf']:null]);}
if($method==='GET'&&$action==='admin-state'){vm_session();vm_reply(['authenticated'=>!empty($_SESSION['admin']),'csrf'=>$_SESSION['csrf'],'publicEnabled'=>false]);}
if($method!=='POST'){header('Allow: GET, POST');vm_reply(['error'=>'Methode nicht erlaubt.'],405);}
if((int)($_SERVER['CONTENT_LENGTH']??0)>12000)vm_reply(['error'=>'Anfrage zu groß.'],413);
if(!str_starts_with(strtolower($_SERVER['CONTENT_TYPE']??''),'application/json'))vm_reply(['error'=>'JSON erwartet.'],415);
$raw=file_get_contents('php://input',false,null,0,12001);if($raw===false||strlen($raw)>12000)vm_reply(['error'=>'Anfrage zu groß.'],413);
try{$input=json_decode($raw,true,16,JSON_THROW_ON_ERROR);}catch(JsonException){vm_reply(['error'=>'Ungültige Anfrage.'],400);}
if(!is_array($input))vm_reply(['error'=>'Ungültige Anfrage.'],400);
$identity=(string)($_SERVER['REMOTE_ADDR']??'unknown');
if($action==='login'){
vm_csrf();if(!vm_limit('login',$identity,900,8)||!vm_limit('login-global','all',900,50))vm_reply(['error'=>'Zu viele Versuche. Bitte versuche es später erneut.'],429);
$password=vm_text($input['password']??'',160);$config=vm_config();if(!$config['admin_hash']||!password_verify($password,$config['admin_hash']))vm_reply(['error'=>'Passwort stimmt nicht.'],401);
session_regenerate_id(true);$_SESSION['admin']=true;$_SESSION['seen']=time();$_SESSION['csrf']=bin2hex(random_bytes(24));vm_reply(['ok'=>true]);}
if(!vm_authenticated())vm_reply(['error'=>'Der interne Test erfordert eine Anmeldung.'],401);
vm_csrf();
if($action==='logout'){$_SESSION=[];session_destroy();setcookie('vm_admin','',['expires'=>time()-3600,'path'=>'/','secure'=>PHP_SAPI!=='cli-server','httponly'=>true,'samesite'=>'Strict']);vm_reply(['ok'=>true]);}
if($action!=='ask')vm_reply(['error'=>'Nicht gefunden.'],404);
$config=vm_config();if(!vm_internal_ready($config))vm_reply(['error'=>'Der interne Test ist noch nicht verfügbar.'],503);
$question=vm_text($input['question']??'',800);if($question==='')vm_reply(['error'=>'Bitte gib eine Frage ein.'],400);
$language=($input['language']??'de')==='en'?'en':'de';$history=$input['history']??[];
if(!is_array($history)||!array_is_list($history)||count($history)>4)throw new InvalidArgumentException('Ungültiger Verlauf.');
$clean=[];foreach($history as$turn){if(!is_array($turn)||!in_array($turn['role']??'', ['user','assistant'],true))throw new InvalidArgumentException('Ungültiger Verlauf.');$clean[]=['role'=>$turn['role'],'content'=>vm_text($turn['content']??'',1000)];}
if(!vm_limit('ask',$identity,600,12)||!vm_limit('api-daily','all',86400,50))vm_reply(['error'=>'Das interne Testlimit ist erreicht. Bitte versuche es später erneut.'],429);
$answer=vm_generate($question,$clean,$language,$config);vm_reply($answer+['mode'=>'ai','internal'=>true]);
}catch(InvalidArgumentException$e){vm_reply(['error'=>$e->getMessage()],400);}catch(Throwable$e){vm_reply(['error'=>'Der Chat ist gerade nicht erreichbar. Schreib Moritz gerne eine E-Mail.'],503);}
