export interface Position {
    x: number;
    y: number;
  }
  export interface Monster {
    id: number;
    name: string;
    position: Position;
    facing: string;
    status: string;
    activatedThisTurn: boolean;
    level: number;
    lastWoundedBy: number;
    negativeTokens?: any;
    blindspot: Position[];
    baseCoordinates: Position[];
    statline: Statline;
  }
  
  export interface Statline {
    width: number;
    height: number;
    movement: number;
    toughness: number;
  }
  
  export interface Survivor {
    id: number;
    name: string;
    status: string;
    activationsLeft: number;
    movesLeft: number;
    position: Position;
    movement: number;
    survival: number;
    bleed: number;
    priorityTarget: boolean;
  }
  
  export interface AttackProfile {
    id: number;
    activationCost: ActivationCost;
    speed: number;
    toHitValue: number;
    strengthBonus: number;
    deadly: boolean;
    reach: number;
    alwaysHits: boolean;
    alwaysCrits: boolean;
    infiniteReach: boolean;
    useName: string;
  }
  
  export interface ActivationCost {
    id: number;
    activation: boolean;
    move: boolean;
    archive: boolean;
  }