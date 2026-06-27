import {
  Card,
  CardRepository,
  CreateCardProps,
  UpdateCardProps,
} from "@memora/core";
import { HttpError } from "../../utils/Errors/http.error";

export class CardService {
  constructor(private cardRepository: CardRepository) {}

  async findAll() {
    return this.cardRepository.findAll();
  }

  async findById(id: string) {
    return this.cardRepository.findById(id);
  }

  async findByDeckId<T>(deckId: string, userId?: string): Promise<T> {
    if (!deckId) throw new HttpError(400, "Deck id is required");
    const deckWithCards = await this.cardRepository.findByDeckId<T>(
      deckId,
      userId,
    );

    if (!deckWithCards) throw new HttpError(404, "Deck not found");

    return deckWithCards;
  }

  async create(card: CreateCardProps): Promise<Card> {
    return await this.cardRepository.create(card);
  }

  async remove(cardId: string) {
    return this.cardRepository.remove(cardId);
  }

  async save(card: UpdateCardProps, cardId: string) {
    return this.cardRepository.save(card, cardId);
  }
}
