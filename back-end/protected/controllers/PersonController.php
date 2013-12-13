<?php

class PersonController extends ERestController
{
    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
     */
    public $layout = '//layouts/column2';

    /**
     * @return array action filters
     */
    public function _filters()
    {
        return array(
            'accessControl', // perform access control for CRUD operations
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function _accessRules()
    {
        return array(
            array('allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index', 'view', 'upload'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update'),
                'users' => array('@'),
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('admin', 'delete'),
                'users' => array('admin'),
            ),
            array('deny', // deny all users
                'users' => array('*'),
            )
        );
    }

    public function actionUpload($id)
    {
        header('Content-type: application/json');
        $person = Person::model()->findByPk($id);

        $image = CUploadedFile::getInstanceByName('image');

        $imageName = 'profile_picture.jpg';

        if ($person && $image)
        {

            Yush::init($person);

            $originalPath = Yush::getPath($person, Yush::SIZE_ORIGINAL, $imageName);
            $largePath = Yush::getPath($person, Yush::SIZE_LARGE, $imageName);
            $thumbPath = Yush::getPath($person, Yush::SIZE_THUMB, $imageName);

            if ($image->saveAs($originalPath))
            {
                $largeImage = Yii::app()->phpThumb->create($originalPath);
                $largeImage->resize(800, 600);
                $largeImage->save($largePath);

                $thumb = Yii::app()->phpThumb->create($originalPath);
                $thumb->resize(300, 225);
                $thumb->save($thumbPath);

                $person->profile_picture = Yush::getUrl($person, Yush::SIZE_LARGE, $imageName);
                $person->save();
            }
        }

        $person->refresh();

        $response = array();
        $response['url'] = Yush::getUrl($person, Yush::SIZE_THUMB, $imageName) . '?' . time();
        echo json_encode($response);
    }

    /**
     * This is broken out as a separate method from actionRestView
     * To allow for easy overriding in the controller
     * adn to allow for easy unit testing
     */
    public function doRestView($id)
    {
        $model = $this->loadOneModel($id);

        if (is_null($model))
        {
            $this->HTTPStatus = 404;
            throw new CHttpException('404', 'Record Not Found');
        }

        $imagePath = Yush::getPath($model, Yush::SIZE_LARGE, 'profile_picture.jpg');
        $imageUrl = Yush::getUrl($model, Yush::SIZE_LARGE, 'profile_picture.jpg');

        if (file_exists($imagePath))
            $model->profile_picture = $imageUrl . '?' . time();
        else
            $model->profile_picture = null;

        $this->outputHelper(
            'Record Retrieved Successfully', $model, 1
        );
    }

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id)
    {
        $this->render('view', array(
            'model' => $this->loadModel($id),
        ));
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate()
    {
        $model = new Person;

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['Person']))
        {
            $model->attributes = $_POST['Person'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->id));
        }

        $this->render('create', array(
            'model' => $model,
        ));
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id)
    {
        $model = $this->loadModel($id);

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['Person']))
        {
            $model->attributes = $_POST['Person'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->id));
        }

        $this->render('update', array(
            'model' => $model,
        ));
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id)
    {
        if (Yii::app()->request->isPostRequest)
        {
            // we only allow deletion via POST request
            $this->loadModel($id)->delete();

            // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
            if (!isset($_GET['ajax']))
                $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
        }
        else
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
    }

    /**
     * Lists all models.
     */
    public function actionIndex()
    {
        $dataProvider = new CActiveDataProvider('Person');
        $this->render('index', array(
            'dataProvider' => $dataProvider,
        ));
    }

    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
        $model = new Person('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Person']))
            $model->attributes = $_GET['Person'];

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer the ID of the model to be loaded
     */
    public function loadModel($id)
    {
        $model = Person::model()->findByPk($id);
        if ($model === null)
            throw new CHttpException(404, 'The requested page does not exist.');
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param CModel the model to be validated
     */
    protected function performAjaxValidation($model)
    {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'person-form')
        {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

}
