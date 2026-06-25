import { ElysiaSetup } from "../..";
import Deck from "./deck.repository";
import DeckService from "./deck.service";

const deckRepository = new Deck();
const deckService = new DeckService(deckRepository);

export const deckRoutes = (app: ElysiaSetup) =>
  app.guard({ auth: true }, (app) =>
    app
      .get("/", () => deckService.getAllDecks())
      .get("/:id", ({ params }) => {
        try {
          return deckService.getDeckById(params.id);
        } catch (error) {
          console.error(error);
          return { error: "Deck not found" };
        }
      })
      .post("/", () => "criar"),
  );
