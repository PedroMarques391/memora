import { CardRepository, Card as ICard, UpdateCardProps } from "@memora/core";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { cardsTable, deckTable } from "../../db/schema";

export class Card implements CardRepository {
  async findAll(userId: string): Promise<ICard[]> {
    const rows = await db
      .select({ card: cardsTable })
      .from(cardsTable)
      .innerJoin(deckTable, eq(cardsTable.deckId, deckTable.id))
      .where(eq(deckTable.userId, userId));

    return rows.map((r) => r.card);
  }

  async findById(id: string): Promise<ICard | undefined> {
    return await db.query.cardsTable.findFirst({
      where: eq(cardsTable.cardId, id),
    });
  }

  async findByDeckId<T = ICard[]>(deckId: string, userId?: string): Promise<T> {
    if (userId) {
      const rows = await db
        .select({
          card: cardsTable,
          deckName: deckTable.name,
          deckId: deckTable.id,
        })
        .from(deckTable)
        .leftJoin(cardsTable, eq(deckTable.id, cardsTable.deckId))
        .where(and(eq(deckTable.id, deckId), eq(deckTable.userId, userId)));

      if (rows.length === 0) return null as unknown as T;

      const cards = rows.map((r) => r.card).filter((c) => c !== null);

      return {
        deckId: rows[0].deckId,
        deckName: rows[0].deckName,
        cards,
      } as T;
    }

    const cards = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));
    return cards as T;
  }

  async create(card: ICard): Promise<ICard> {
    return await db.insert(cardsTable).values(card);
  }
  async remove(cardId: string): Promise<void> {
    return await db.delete(cardsTable).where(eq(cardsTable.cardId, cardId));
  }

  async save(card: UpdateCardProps, cardId: string): Promise<void> {
    return await db
      .update(cardsTable)
      .set(card)
      .where(eq(cardsTable.cardId, cardId));
  }
}
