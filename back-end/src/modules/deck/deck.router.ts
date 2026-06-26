import { z } from "zod";
import { ElysiaSetup } from "../..";
import Deck from "./deck.repository";
import DeckService from "./deck.service";

const deckRepository = new Deck();
const deckService = new DeckService(deckRepository);

export const deckRoutes = (app: ElysiaSetup) =>
  app.guard({ auth: true }, (app) =>
    app
      .get("/", () => deckService.getAllDecks())
      .get("/:id", async ({ params, set }) => {
        try {
          return await deckService.getDeckById(params.id);
        } catch (error) {
          console.error(error);
          set.status = 404;
          return { error: "Deck not found" };
        }
      })
      .get(
        "/user/:userId",
        async ({ params, set }) => {
          try {
            const decks = await deckService.getDecksByUserId(params.userId);
            set.status = 200;
            return decks.map((deck) => ({
              ...deck,
              createdAt: deck.createdAt.toISOString(),
              updatedAt: deck.updatedAt.toISOString(),
            }));
          } catch (error) {
            console.error(error);
            set.status = 404;
            return { error: "Deck not found" };
          }
        },
        {
          params: z.object({
            userId: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
                createdAt: z.iso.datetime(),
                updatedAt: z.iso.datetime(),
              }),
            ),
            401: z.object({
              error: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      )
      .post(
        "/",
        async ({ body, set }) => {
          try {
            const result = await deckService.createDeck(body);
            set.status = 201;
            return result;
          } catch (error) {
            console.error(error);
            set.status = 400;
            return { error: "Failed to create deck" };
          }
        },
        {
          body: z.object({
            name: z
              .string()
              .max(100, "Name must be at most 100 characters long")
              .min(1, "Name must be at least 1 character long"),
            description: z
              .string()
              .max(500, "Description must be at most 500 characters long")
              .min(1, "Description must be at least 1 character long"),
            userId: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string(),
              response: z.string(),
            }),
            401: z.object({
              error: z.string(),
            }),
            400: z.object({
              error: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      ),
  );
