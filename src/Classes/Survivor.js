import React  from 'react';

export class Survivor {
    constructor(name, position){
        this.name = name;
        this.status = "STANDING";

        this.activationsLeft = 1;
        this.movesLeft = 1;

        this.position = position;
        this.movement = 5;

        this.survival = 1;
        this.bleed = 0;
    }

    printStatus(){
        console.log(this.name +" is " +this.status);
    }

    setStatus(newStatus){
        this.status = newStatus;
    }
}