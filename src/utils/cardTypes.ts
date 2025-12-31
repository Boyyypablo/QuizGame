export interface CardData {
  id: number;
  perguntas: [string, string, string];
}

export interface CardsData {
  cartas_quebra_gelo: CardData[];
}

export interface GameState {
  availableCards: CardData[];
  drawnCards: CardData[];
  lastReset: number;
}

