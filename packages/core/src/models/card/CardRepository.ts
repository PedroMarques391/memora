import { Card, CreateCardProps, UpdateCardProps } from "./Card";

export interface CardRepository {
  findById(cardId: string): Promise<Card | undefined>;
  findByDeckId(deckId: string): Promise<Card[]>;
  save(card: UpdateCardProps, cardId: string): Promise<void>;
  remove(cardId: string): Promise<void>;
  findAll(): Promise<Card[]>;
  create(card: CreateCardProps): Promise<Card>;
}
