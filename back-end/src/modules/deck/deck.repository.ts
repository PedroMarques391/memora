import { DeckRepository, Deck as IDeck } from "@memora/core";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { deckTable } from "../../db/schema";

export default class Deck implements DeckRepository {
  async findAll(): Promise<IDeck[]> {
    const decks = await db.query.deckTable.findMany();
    return decks;
  }

  async findById(id: string): Promise<IDeck | undefined> {
    const deck = await db.query.deckTable.findFirst({
      where: eq(deckTable.id, id),
    });

    return deck;
  }

  async edit(deck: IDeck): Promise<void> {}

  async remove(id: string): Promise<void> {}

  async save(deck: IDeck): Promise<void> {}
}
