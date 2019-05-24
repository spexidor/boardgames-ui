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
    positiveTokens?: any;
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

  export interface AiDeck {
    id: number;
    cardsInDeck: AICard[];
    cardsInDiscard: AICard[];
    cardsRemoved: AICard[];
    basicAction: AICard;
}

export interface HlDeck {
  id: number;
  cardsInDeck: HlCard[];
  cardsInDiscard: HlCard[];
  cardsRemoved: HlCard[];
}

export interface AICard {
  type: string;
  id: number;
  orderInDeck: number;
  title: string;
  targetRule: TargetRule;
  attack: Attack;
  noTarget: CardEffect;
  noMove: boolean;
}

export interface TargetRule {
  id: number;
  targetOrder: TargetOrder[];
}

export interface Attack {
  speed: number;
  toHitValue: number;
  damage: number;
  ignoreEvasion: boolean;
  reach: number;
  name: string;
  targetLocation: string;
  trigger: Trigger;
  triggerEffect: CardEffect;
}

export interface Trigger {
  afterDamage: boolean;
  afterHit: boolean;
}

export interface CardEffect {
  condition?: any;
  move?: any;
  name?: any;
  description: string;
  bleed: number;
  brainDamage: number;
  damage: number;
  knockDown: boolean;
  grab: boolean;
  basicAttack: boolean;
  priorityToken: boolean;
  drawAI: number;
  knockBack: number;
  attackExtraDamage: number;
  gainSurvival: number;
  gainUnderstanding: number;
  gainCourage: number;
  monsterKnockDown: boolean;
  monsterDiesNextTurn: boolean;
}

export interface TargetOrder {
  id: number;
  closest: boolean;
  threat: boolean;
  facing: boolean;
  inRange: boolean;
  inFieldOfView: boolean;
  knockedDown: boolean;
  blindSpot: boolean;
  random: boolean;
  lastToWound: boolean;
}

export interface HlCard {
  type: string;
  id: number;
  orderInDeck: number;
  title: string;
  trap: boolean;
  impervious: boolean;
  description: string;
  woundEffect: boolean;
  reflexEffect: boolean;
  failureEffect: boolean;
  critable: boolean;
  criticalWound: CriticalWound;
  effect?: any;
}
export interface CriticalWound {
  id: number;
  description?: any;
  hlCardTableResult?: any;
  cardEffect: CardEffect;
  persistantInjury: boolean;
}
