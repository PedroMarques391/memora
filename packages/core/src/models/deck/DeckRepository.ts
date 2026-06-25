import type { CreateDeckProps, Deck } from "./Deck";

export interface DeckRepository {
  findById(id: string): Promise<Deck | undefined>;
  findByUserId(userId: string): Promise<Deck[]>;
  save(deck: Partial<Deck>, id: string): Promise<void>;
  remove(id: string): Promise<void>;
  findAll(): Promise<Deck[]>;
  create(deck: CreateDeckProps): Promise<Deck>;
}
