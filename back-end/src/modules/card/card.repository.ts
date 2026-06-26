import { CardRepository, Card as ICard, UpdateCardProps } from "@memora/core";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { cardsTable } from "../../db/schema";

export class Card implements CardRepository {
  async findAll(): Promise<ICard[]> {
    return db.query.cardsTable.findMany();
  }

  async findById(id: string): Promise<ICard | undefined> {
    return db.query.cardsTable.findFirst({ where: eq(cardsTable.cardId, id) });
  }

  async findByDeckId(deckId: string): Promise<ICard[]> {
    return db.query.cardsTable.findMany({
      where: eq(cardsTable.deckId, deckId),
    });
  }

  async create(card: ICard): Promise<ICard> {
    await db.insert(cardsTable).values(card);
    return card;
  }
  async remove(cardId: string): Promise<void> {
    await db.delete(cardsTable).where(eq(cardsTable.cardId, cardId));
  }

  async save(card: UpdateCardProps, cardId: string): Promise<void> {
    await db.update(cardsTable).set(card).where(eq(cardsTable.cardId, cardId));
  }
}
