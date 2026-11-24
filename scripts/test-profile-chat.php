<?php
declare(strict_types=1);
$testDir = sys_get_temp_dir().'/frag-moritz-test-'.bin2hex(random_bytes(8));
mkdir($testDir,0700);
$resolvedTestDir=realpath($testDir);
if ($resolvedTestDir===false || !str_starts_with(basename($resolvedTestDir),'frag-moritz-test-')) throw new RuntimeException('Unsafe test path');
register_shutdown_function(function()use($resolvedTestDir){foreach(['config.json','limits.json'] as $name){$file=$resolvedTestDir.DIRECTORY_SEPARATOR.$name;if(is_file($file))unlink($file);}rmdir($resolvedTestDir);});
file_put_contents($resolvedTestDir.'/config.json',json_encode(['admin_hash'=>password_hash('isolated-test-password-only',PASSWORD_DEFAULT),'salt'=>bin2hex(random_bytes(32)),'api_key'=>'','ai_enabled'=>false,'model'=>'gpt-6.1-terra','daily_limit'=>50],JSON_THROW_ON_ERROR));
putenv('FRAG_MORITZ_PRIVATE_DIR='.$resolvedTestDir);
require dirname(__DIR__).'/api/frag-moritz-core.php';
$checks=0;$failures=[];
function check(bool $ok,string $name):void{global $checks,$failures;$checks++;if(!$ok)$failures[]=$name;}
$records=fm_knowledge();check(count($records)===15,'15 seed records');check(!fm_ready(fm_config()),'AI disabled without key');
foreach (['Which languages does he work with?'=>'technik','Which projects has Moritz worked on?'=>'projekte','How can I reach Moritz?'=>'kontakt','Welche Sprachen nutzt Moritz?'=>'technik','Mit welchen Sprachen arbeitet er?'=>'technik','Was war sein Beitrag bei Lekkerland?'=>'lekkerland','Was hat Moritz bei Eisberg gemacht?'=>'eisberg','Wie verbindet Moritz Design, Technik, Sichtbarkeit?'=>'profil','Wie erreiche ich Moritz?'=>'kontakt','Was macht er aktuell bei Hottgenroth?'=>'hottgenroth','What was his role at Friendventure?'=>'friendventure'] as $question=>$id){$found=fm_retrieve($question,$records);check(($found[0]['id']??'')===$id,$question);}
foreach (['Wie alt ist Moritz?','Was ist seine Lieblingsfarbe?','How much does Moritz earn?','Kann Moritz Python?'] as $q)check(fm_retrieve($q,$records)===[],'Unknown stays unknown: '.$q);
$good=$records;$good[0]['url']='javascript:alert(1)';try{fm_validate_knowledge($good);check(false,'Reject javascript URL');}catch(InvalidArgumentException $e){check(true,'Reject javascript URL');}
$good=$records;$good[1]['id']=$good[0]['id'];try{fm_validate_knowledge($good);check(false,'Reject duplicate IDs');}catch(InvalidArgumentException $e){check(true,'Reject duplicate IDs');}
$good=$records;$good[0]['url']='//evil.example';try{fm_validate_knowledge($good);check(false,'Reject protocol relative URL');}catch(InvalidArgumentException $e){check(true,'Reject protocol relative URL');}
$good=$records;$good[0]['enabled']=false;check(!in_array('profil',array_column(fm_retrieve('Wer ist Moritz?',$good),'id'),true),'Disabled facts excluded');
$context=fm_retrieve('Beitrag bei Lekkerland',$records);$payload=fm_model_payload('Beitrag bei Lekkerland',$context,'de',[],'gpt-6.1-terra');check($payload['store']===false,'No response storage');check($payload['max_output_tokens']===650,'Output cap');check($payload['reasoning']['effort']==='none','Bounded reasoning');check(!str_contains(json_encode($payload),'admin_hash'),'No credentials in model context');check($payload['text']['format']['strict']===true,'Strict output schema');
function response(array $answer):array{return ['status'=>'completed','output'=>[['content'=>[['type'=>'output_text','text'=>json_encode($answer)]]]]];}
check(fm_validate_answer(response(['answer'=>'Technische Umsetzung.','answerable'=>true,'source_ids'=>['lekkerland']]),$context)!==null,'Accept valid sourced response');
check(fm_validate_answer(response(['answer'=>'Falsch','answerable'=>true,'source_ids'=>['invented']]),$context)===null,'Reject fabricated source');
check(fm_validate_answer(response(['answer'=>'Falsch','answerable'=>true,'source_ids'=>[]]),$context)===null,'Reject unsourced claim');
$unknown=fm_validate_answer(response(['answer'=>'irrelevant','answerable'=>false,'source_ids'=>[]]),$context);check($unknown['sources']===[]&&str_contains($unknown['answer'],'keine freigegebenen'),'Unknown model response safely handled');
check(fm_validate_answer(['status'=>'incomplete'],$context)===null,'Reject incomplete generation');
check(count(fm_context([],$records,'de'))===15,'Small approved knowledge base supports semantic questions');
check(fm_context([],array_merge($records,$records),'de')===[],'Large unknown context is not sent unbounded');
check(fm_validate_answer(response(['answer'=>'test','answerable'=>true,'source_ids'=>[['nested']]]),$context)===null,'Reject non-string source IDs');
$allowed=0;$bucket='unit-'.bin2hex(random_bytes(4));for($i=0;$i<12;$i++)if(fm_limit($bucket,'unit',600,5))$allowed++;check($allowed===5,'Atomic usage cap');
echo json_encode(['checks'=>$checks,'failures'=>$failures],JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)."\n";exit($failures?1:0);
