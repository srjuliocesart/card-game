<?php

namespace Model;

use App\SQLiteConnection;

class Cards {

    private $id;
    private $power;

    public function __construct(){
        $this->pdo = (new SQLiteConnection())->connect();
    }
    
    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of power
     */ 
    public function getPower()
    {
        return $this->power;
    }

    /**
     * Set the value of power
     *
     * @return  self
     */ 
    public function setPower($power)
    {
        $this->power = $power;

        return $this;
    }

    public function listAll(){
        $list = $this->pdo->query("SELECT * FROM card");
        return $list->fetchAll(\PDO::FETCH_ASSOC);
    }
}