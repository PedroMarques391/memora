import { Card, CreateCardProps, UpdateCardProps } from "./Card";

export interface CardRepository {
  findById(cardId: string): Promise<Card | undefined>;
  findByDeckId<T = Card[]>(deckId: string, userId?: string): Promise<T>;
  save(card: UpdateCardProps, cardId: string): Promise<void>;
  remove(cardId: string): Promise<void>;
  findAll(): Promise<Card[]>;
  create(card: CreateCardProps): Promise<Card>;
}
