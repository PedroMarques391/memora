export interface Card {
  cardId: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: Date;
  updatedAt: Date;
  reviewCount: number;
}

export type CreateCardProps = Omit<
  Card,
  "cardId" | "createdAt" | "updatedAt" | "reviewCount"
>;
export type UpdateCardProps = Pick<Card, "front" | "back" | "deckId">;
