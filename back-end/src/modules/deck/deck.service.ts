import { CreateDeckProps, DeckRepository, UpdateDeckProps } from "@memora/core";
import { HttpError } from "../../utils/Errors/http.error";

export default class DeckService {
  constructor(private readonly deckRepository: DeckRepository) {}

  async getAllDecks() {
    return this.deckRepository.findAll();
  }

  async getDeckById(id: string, userId: string) {
    const deck = await this.deckRepository.findById(id);

    if (!deck) {
      throw new HttpError(404, `Deck with id ${id} not found`);
    }

    if (deck.userId !== userId) {
      throw new HttpError(403, "You do not have permission to view this deck");
    }

    return deck;
  }

  async getDecksByUserId(userId: string) {
    if (!userId) {
      throw new HttpError(400, "User id is required");
    }
    return this.deckRepository.findByUserId(userId);
  }

  async createDeck(
    deck: CreateDeckProps,
  ): Promise<{ id: string; response: string }> {
    const createdDeck = await this.deckRepository.create(deck);
    if (!createdDeck) {
      throw new HttpError(500, "Failed to create deck");
    }
    return {
      id: createdDeck.id,
      response: "Deck created successfully",
    };
  }

  async updateDeck(deck: UpdateDeckProps, id: string, userId: string) {
    const hasDeck = await this.deckRepository.findById(id);
    if (!id || !hasDeck) throw new HttpError(404, "Deck not found");

    if (hasDeck.userId !== userId) {
      throw new HttpError(403, "You do not have permission to update this deck");
    }

    return await this.deckRepository.save(deck, id);
  }

  async deleteDeck(id: string, userId: string) {
    const hasDeck = await this.deckRepository.findById(id);
    if (!id || !hasDeck) throw new HttpError(404, "Deck not found");

    if (hasDeck.userId !== userId) {
      throw new HttpError(403, "You do not have permission to delete this deck");
    }

    return await this.deckRepository.remove(id);
  }
}
