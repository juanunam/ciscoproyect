<?php
if($_GET['command'] == 'getTransactions'){
	//echo 'dsadsas';
	$res = shell_exec(' ../python/.tox/py36/bin/python -W ignore ../python/src/main.py ../python/src/model.persisted ../data/validation.json  2>&1');
	echo $res;

}elseif ($_GET['command'] == 'getOriginalSource') {
	$res = shell_exec(' ../python/.tox/py36/bin/python -W ignore ../python/src/sources.py ../python/src/entrenamiento.json  2>&1');
	echo $res;
	
}
?>
