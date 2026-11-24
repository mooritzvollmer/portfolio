<?php
declare(strict_types=1);
ini_set('display_errors','0');
header('X-Robots-Tag: noindex, nofollow'); header('Cache-Control: no-store'); header('X-Content-Type-Options: nosniff'); header('Referrer-Policy: same-origin');
require __DIR__.'/frag-moritz-core.php';
try {
    $origin=$_SERVER['HTTP_ORIGIN']??'';
    $allowedOrigin='https://moritzvollmer.de';
    $devOrigin=getenv('FRAG_MORITZ_DEV_ORIGIN'); if ($devOrigin && str_starts_with($devOrigin,'http://127.0.0.1:')) $allowedOrigin=$devOrigin;
    if ($origin!=='' && $origin!==$allowedOrigin) fm_reply(['error'=>'Origin not allowed'],403);
    if (($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site') fm_reply(['error'=>'Origin not allowed'],403);
    $action=$_GET['action']??'status'; $method=$_SERVER['REQUEST_METHOD']??'GET';
    if (!is_string($action)) fm_reply(['error'=>'Ungültige Aktion.'],400);
    if ($method==='GET' && $action==='status') fm_reply(['ready'=>fm_ready(fm_config()),'mode'=>fm_ready(fm_config())?'ai':'knowledge']);
    if ($method==='GET' && $action==='admin-state') {
        fm_session(); $auth=!empty($_SESSION['admin']); $out=['authenticated'=>$auth,'csrf'=>$_SESSION['csrf']];
        if ($auth) { $config=fm_config(); $out+=['records'=>fm_knowledge(),'ready'=>fm_ready($config),'keyPresent'=>fm_key($config)!=='','aiEnabled'=>(bool)$config['ai_enabled'],'model'=>$config['model'],'dailyLimit'=>(int)$config['daily_limit']]; }
        fm_reply($out);
    }
    if ($method!=='POST') { header('Allow: GET, POST'); fm_reply(['error'=>'Methode nicht erlaubt.'],405); }
    if ((int)($_SERVER['CONTENT_LENGTH']??0)>300000) fm_reply(['error'=>'Anfrage zu groß.'],413);
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE']??''),'application/json')) fm_reply(['error'=>'JSON erwartet.'],415);
    $raw=file_get_contents('php://input',false,null,0,300001); if ($raw===false||strlen($raw)>300000) fm_reply(['error'=>'Anfrage zu groß.'],413);
    try { $input=json_decode($raw,true,64,JSON_THROW_ON_ERROR); } catch(Throwable $e) { fm_reply(['error'=>'Ungültiges JSON.'],400); }
    if (!is_array($input)) fm_reply(['error'=>'Ungültige Anfrage.'],400);
    $identity=(string)($_SERVER['REMOTE_ADDR']??'unknown');
    if ($action==='login') {
        fm_csrf();
        if (!fm_limit('login',$identity,900,8)||!fm_limit('login-global','all',900,80)) fm_reply(['error'=>'Zu viele Versuche. Bitte später erneut versuchen.'],429);
        $password=fm_text($input['password']??'',160); $config=fm_config();
        if (!$config['admin_hash'] || !password_verify($password,$config['admin_hash'])) fm_reply(['error'=>'Passwort stimmt nicht.'],401);
        session_regenerate_id(true); $_SESSION['admin']=true; $_SESSION['seen']=time(); $_SESSION['csrf']=bin2hex(random_bytes(24)); fm_reply(['ok'=>true]);
    }
    if ($action==='logout') { fm_admin(); fm_csrf(); $_SESSION=[]; session_regenerate_id(true); fm_reply(['ok'=>true]); }
    if ($action==='save-knowledge') {
        fm_admin(); fm_csrf(); $records=fm_validate_knowledge($input['records']??null); $old=fm_knowledge();
        fm_json_write('knowledge-previous',['records'=>$old,'savedAt'=>gmdate('c')]); fm_json_write('knowledge',['records'=>$records,'savedAt'=>gmdate('c')]); fm_reply(['ok'=>true,'count'=>count($records)]);
    }
    if ($action==='save-settings') { fm_admin(); fm_csrf(); fm_reply(['error'=>'Externe KI-Dienste sind aus Kostengründen gesperrt.'],403); }
    if ($action==='ask' || $action==='test') {
        $test=$action==='test'; if ($test) { fm_admin(); fm_csrf(); }
        if (strlen($raw)>16000) fm_reply(['error'=>'Anfrage zu groß.'],413);
        $question=fm_text($input['question']??'',800); if ($question==='') throw new InvalidArgumentException('Bitte eine Frage eingeben.');
        $lang=($input['language']??'de')==='en'?'en':'de';
        if (!fm_limit('ask',$identity,600,20)||!fm_limit('ask-global','all',600,600)) fm_reply(['error'=>$lang==='en'?'Too many questions. Please try again later.':'Zu viele Fragen. Bitte versuche es später erneut.'],429);
        $history=[]; $provided=$input['history']??[];
        if (!is_array($provided)||count($provided)>6) throw new InvalidArgumentException('Ungültiger Verlauf.');
        foreach ($provided as $turn) { if (!is_array($turn)||!in_array($turn['role']??'', ['user','assistant'],true)) throw new InvalidArgumentException('Ungültiger Verlauf.'); $history[]=['role'=>$turn['role'],'content'=>fm_text($turn['content']??'',1800)]; }
        $records=fm_knowledge(); $context=fm_retrieve($question,$records);
        if (!$context && preg_match('/\b(dort|dazu|dabei|darueber|there|that|those)\b/u',fm_normalize($question))) {
            foreach (array_reverse($history) as $turn) if ($turn['role']==='user') { $context=fm_retrieve($turn['content'],$records); break; }
        }
        $sensitive=(bool)preg_match('/passwo(?:e|r)|password|api[ -]?(?:key|schluessel)|system[ -]?prompt|private[ -]?key|ignore.*instruction|ignoriere.*anweisung/ui',fm_normalize($question)); if($sensitive)$context=[];
        $config=fm_config(); $fallback=fm_fallback($context,$lang); $ready=fm_ready($config); $fallback['availableAi']=$ready;
        if (!fm_allow_ai($config,($input['allowAi']??false)===true,$test) || $sensitive) fm_reply($fallback);
        $modelContext=fm_context($context,$records,$lang); if(!$modelContext)fm_reply($fallback);
        if (!fm_limit('api-daily','all',86400,(int)$config['daily_limit'])) fm_reply(fm_fallback($context,$lang,'daily-limit')+['availableAi'=>$ready]);
        $payload=fm_model_payload($question,$modelContext,$lang,$history,$config['model']);
        $response=fm_generate($payload,fm_key($config)); $answer=$response?fm_validate_answer($response,$modelContext,$lang):null;
        fm_reply(($answer ?? fm_fallback($context,$lang,'provider-unavailable'))+['availableAi'=>$ready]);
    }
    fm_reply(['error'=>'Nicht gefunden.'],404);
} catch(InvalidArgumentException $e) { fm_reply(['error'=>$e->getMessage()],400); }
catch(Throwable $e) { fm_reply(['error'=>'Der Chat ist gerade nicht erreichbar. Du kannst Moritz per E-Mail kontaktieren.'],503); }
