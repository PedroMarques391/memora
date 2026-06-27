import z from "zod";
import { ElysiaSetup } from "../..";
import { Card as CardRepository } from "./card.repository";
import { CardService } from "./card.service";

const cardRepository = new CardRepository();
const cardService = new CardService(cardRepository);

export const cardRoutes = (app: ElysiaSetup) =>
  app.guard({ auth: true }, (app) =>
    app
      .get("/", async ({ user }) => await cardService.findAll(user.id))
      .post(
        "/",
        async ({ body, params }) => {
          await cardService.create({ ...body, deckId: params.deckId });
        },
        {
          body: z.object({
            front: z.string(),
            back: z.string(),
          }),
          params: z.object({
            deckId: z.string(),
          }),
        },
      ),
  );
