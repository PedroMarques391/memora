import { CreateDeckProps, DeckRepository } from "@memora/core";

export default class DeckService {
  constructor(private readonly deckRepository: DeckRepository) {}

  async getAllDecks() {
    return this.deckRepository.findAll();
  }

  async getDeckById(id: string) {
    const deck = await this.deckRepository.findById(id);

    if (!deck) {
      throw new Error(`Deck with id ${id} not found`);
    }
    return deck;
  }

  async getDecksByUserId(userId: string) {
    if (!userId) {
      throw new Error("User id is required");
    }
    return this.deckRepository.findByUserId(userId);
  }

  async createDeck(
    deck: CreateDeckProps,
  ): Promise<{ id: string; response: string }> {
    const createdDeck = await this.deckRepository.create(deck);
    if (!createdDeck) {
      throw new Error("Failed to create deck");
    }
    return {
      id: createdDeck.id,
      response: "Deck created successfully",
    };
  }
}
