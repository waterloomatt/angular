<?php

/**
 * This is the model class for table "{{person}}".
 *
 * The followings are the available columns in table '{{person}}':
 * @property integer $id
 * @property string $first_name
 * @property string $last_name
 * @property string $date_of_birth
 * @property string $profile_picture
 * @property string $biography
 */
class Person extends CActiveRecord
{

    /**
     * Returns the static model of the specified AR class.
     * @param string $className active record class name.
     * @return Person the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return '{{person}}';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('first_name, last_name, date_of_birth', 'required'),
            array('first_name, last_name, profile_picture', 'length', 'max' => 50),
            // The following rule is used by search().
            // Please remove those attributes that should not be searched.
            array('id, first_name, last_name, date_of_birth, profile_picture', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'date_of_birth' => 'Date Of Birth',
            'profile_picture' => 'Profile Picture',
            'biography' => 'Biography',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
     */
    public function search()
    {
        // Warning: Please modify the following code to remove attributes that
        // should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('first_name', $this->first_name, true);
        $criteria->compare('last_name', $this->last_name, true);
        $criteria->compare('date_of_birth', $this->date_of_birth, true);
        $criteria->compare('profile_picture', $this->profile_picture, true);
        $criteria->compare('biography', $this->biography, true);

        return new CActiveDataProvider($this, array(
                'criteria' => $criteria,
            ));
    }

}