import type { CreateDeckProps, Deck, UpdateDeckProps } from "./Deck";

export interface DeckRepository {
  findById(id: string, userId: string): Promise<Deck | undefined>;
  findByUserId(userId: string): Promise<Deck[]>;
  save(deck: UpdateDeckProps, id: string, userId: string): Promise<void>;
  remove(id: string, userId: string): Promise<void>;
  findAll(): Promise<Deck[]>;
  create(deck: CreateDeckProps): Promise<Deck>;
}
