<?php

header('Content-type: text/json');
header('Content-type: application/json');

$family = array();
$family['title'] = 'the skeltons';
$family['members'] = array(
    array(
        'id' => 1,
        'name' => 'Matt Skelton',
        'age' => 31
    ),
    array(
        'id' => 2,
        'name' => 'Bill Skelton',
        'age' => 60
    ),
    array(
        'id' => 3,
        'name' => 'Liz Skelton',
        'age' => 57
    ),
    array(
        'id' => 4,
        'name' => 'Jo Skelton',
        'age' => 29
    ),
    array(
        'id' => 5,
        'name' => 'Angela Smith',
        'age' => 33
    ),
    array(
        'id' => 6,
        'name' => 'Josh Morrison',
        'age' => 34
    ),
    array(
        'id' => 7,
        'name' => 'Rhona Skelton',
        'age' => 78
    )
);

echo json_encode($family);
?>