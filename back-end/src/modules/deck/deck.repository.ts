import {
  CreateDeckProps,
  DeckRepository,
  Deck as IDeck,
  UpdateDeckProps,
} from "@memora/core";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { deckTable } from "../../db/schema";

export default class Deck implements DeckRepository {
  async findAll(): Promise<IDeck[]> {
    const decks = await db.query.deckTable.findMany();
    return decks;
  }

  async findById(id: string, userId: string): Promise<IDeck | undefined> {
    const deck = await db.query.deckTable.findFirst({
      where: and(eq(deckTable.id, id), eq(deckTable.userId, userId)),
    });

    return deck;
  }

  async findByUserId(userId: string): Promise<IDeck[]> {
    const decks = await db.query.deckTable.findMany({
      where: eq(deckTable.userId, userId),
    });
    return decks;
  }

  async create(deck: CreateDeckProps): Promise<IDeck> {
    const [createdDeck] = await db
      .insert(deckTable)
      .values({
        userId: deck.userId,
        name: deck.name,
        description: deck.description,
      })
      .returning();
    return createdDeck;
  }

  async remove(id: string, userId: string): Promise<void> {
    await db
      .delete(deckTable)
      .where(and(eq(deckTable.id, id), eq(deckTable.userId, userId)));
  }

  async save(deck: UpdateDeckProps, id: string, userId: string): Promise<void> {
    await db
      .update(deckTable)
      .set({
        name: deck.name,
        description: deck.description,
      })
      .where(and(eq(deckTable.id, id), eq(deckTable.userId, userId)));
  }
}
