<?php

return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'My Web Application',
    'preload' => array('log'),
    'import' => array(
        'application.models.*',
        'application.components.*',
        'ext.restfullyii.components.*',
        'ext.yush.*',
    ),
    'modules' => array(
        'gii' => array(
            'class' => 'system.gii.GiiModule',
            'password' => 'giiMe',
            'ipFilters' => array('127.0.0.1', '::1'),
        ),
    ),
    'components' => array(
        'yush' => array(
            'class' => 'ext.yush.YushComponent',
            'baseDirectory' => 'uploads',
            'lowercase' => true,
            'template' => array(
                'Person' => array(
                    'original' => '{model}{modelId}',
                    'large' => '{model}{modelId}',
                    'thumb' => '{model}{modelId}',
                )
            ),
        ),
        'phpThumb' => array(
            'class' => 'ext.EPhpThumb.EPhpThumb',
            'options' => array(
            //optional phpThumb specific options are added here
            )
        ),
        'user' => array(
            'allowAutoLogin' => true,
        ),
        'urlManager' => array(
            'urlFormat' => 'path',
            'rules' => require(dirname(__FILE__) . '/../extensions/restfullyii/config/routes.php'),
            'showScriptName' => false,
            'caseSensitive' => true,
        ),
        'db' => array(
            'connectionString' => 'mysql:host=localhost;dbname=mattskel_remodel',
            'emulatePrepare' => true,
            'username' => 'mattskel_mattske',
            'password' => 'lLB0KE468qqi',
            'charset' => 'utf8',
            'tablePrefix' => 'ng_',
        ),
        'errorHandler' => array(
            'errorAction' => 'site/error',
        ),
        'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning',
                )
            ),
        ),
    ),
    // using Yii::app()->params['paramName']
    'params' => array(
        'adminEmail' => 'webmaster@example.com',
        'RESTusername' => 'admin@restuser',
        'RESTpassword' => 'admin@Access'
    ),
);
