import { Elysia } from "elysia";
import Deck from "./deck.repository";
import DeckService from "./deck.service";

const deckRepository = new Deck();
const deckService = new DeckService(deckRepository);

export const deckRoutes = new Elysia({ prefix: "/decks" })
  .get("/", () => deckService.getAllDecks())
  .get("/:id", ({ params }) => {
    try {
      return deckService.getDeckById(params.id);
    } catch (error) {
      console.error(error);
      return { error: "Deck not found" };
    }
  })
  .post("/", () => "criar");
