export interface Deck {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDeckProps = Omit<Deck, "id" | "createdAt" | "updatedAt">;
