import { DeckRepository } from "@memora/core";

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
}
