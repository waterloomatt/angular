<?php

// This is the local Web application configuration.
// Any writable CWebApplication properties can be configured here.
return CMap::mergeArray(
        require(dirname(__FILE__) . '/main.php'), array(
        'modules' => array(
            // uncomment the following to enable the Gii tool
            'gii' => array(
                'class' => 'system.gii.GiiModule',
                'password' => 'giiMe',
                'generatorPaths' => array(
                    'bootstrap.gii', // since 0.9.1
                ),
            ),
        ),
        // application components
        'components' => array(
            // uncomment the following to use a MySQL database
            'db' => array(
                'connectionString' => 'mysql:host=127.0.0.1;dbname=angular',
                'emulatePrepare' => true,
                'username' => 'root',
                'password' => 'passwordHere',
                'charset' => 'utf8',
                'tablePrefix' => 'ng_',
                //'enableProfiling' => true,
                'schemaCachingDuration' => 0
            ),
            'log' => array(
                'class' => 'CLogRouter',
                'routes' => array(
                    array(
                        'class' => 'CFileLogRoute',
                        'levels' => 'error, warning, info',
                    ),
                    // uncomment the following to show log messages on web pages
                    array(
                        'class' => 'CWebLogRoute',
                        'levels' => 'error, warning, info',
                    ),
                    array(
                        'class' => 'CProfileLogRoute',
                        'levels' => 'profile',
                    ),
                // uncomment the following to show log messages on web pages
                /* array(
                  'class' => 'CWebLogRoute',
                  ), */
                ),
            ),
        ),
    ));
