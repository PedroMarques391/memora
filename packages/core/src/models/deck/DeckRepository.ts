import { Deck } from "./Deck";

export interface DeckRepository {
  findById(id: string): Promise<Deck | undefined>;
  save(deck: Deck): Promise<void>;
  remove(id: string): Promise<void>;
  findAll(): Promise<Deck[]>;
  edit(deck: Deck): Promise<void>;
}
