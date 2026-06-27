import { z } from "zod";
import { ElysiaSetup } from "../..";
import { HttpError } from "../../utils/Errors/http.error";
import { Card as ICard } from "@memora/core";
import { Card as CardRepository } from "../card/card.repository";
import { CardService } from "../card/card.service";
import Deck from "./deck.repository";
import DeckService from "./deck.service";

const deckRepository = new Deck();
const deckService = new DeckService(deckRepository);

const cardRepository = new CardRepository();
const cardService = new CardService(cardRepository);

type DeckWithCardsResponse = {
  deckId: string;
  deckName: string;
  cards: ICard[];
};

export const deckRoutes = (app: ElysiaSetup) =>
  app.guard({ auth: true }, (app) =>
    app
      .get("/", () => deckService.getAllDecks())
      .get("/:id", async ({ params, set, user }) => {
        try {
          return await deckService.getDeckById(params.id, user.id);
        } catch (error: unknown) {
          if (error instanceof HttpError) {
            set.status = error.status;
            return { error: error.message };
          }
          if (error instanceof Error) {
            set.status = 500;
            return { error: error.message };
          }
          set.status = 500;
          return { error: "An unexpected error occurred" };
        }
      })
      .get(
        "/user",
        async ({ set, user }) => {
          try {
            const decks = await deckService.getDecksByUserId(user.id);
            set.status = 200;
            return decks.map((deck) => ({
              ...deck,
              createdAt: deck.createdAt.toISOString(),
              updatedAt: deck.updatedAt.toISOString(),
            }));
          } catch (error: unknown) {
            if (error instanceof HttpError) {
              set.status = error.status;
              return { error: error.message };
            }
            if (error instanceof Error) {
              set.status = 500;
              return { error: error.message };
            }
            set.status = 500;
            return { error: "An unexpected error occurred" };
          }
        },
        {
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
                createdAt: z.string().datetime(),
                updatedAt: z.string().datetime(),
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
        async ({ body, set, user }) => {
          try {
            const result = await deckService.createDeck({
              ...body,
              userId: user.id,
            });
            set.status = 201;
            return result;
          } catch (error: unknown) {
            if (error instanceof HttpError) {
              set.status = error.status;
              return { error: error.message };
            }
            if (error instanceof Error) {
              set.status = 500;
              return { error: error.message };
            }
            set.status = 500;
            return { error: "An unexpected error occurred" };
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
      )
      .delete(
        "/:id",
        async ({ params, set, user }) => {
          try {
            await deckService.deleteDeck(params.id, user.id);
            set.status = 204;
          } catch (error: unknown) {
            if (error instanceof HttpError) {
              set.status = error.status;
              return { error: error.message };
            }
            if (error instanceof Error) {
              set.status = 500;
              return { error: error.message };
            }
            set.status = 500;
            return { error: "An unexpected error occurred" };
          }
        },
        {
          params: z.object({
            id: z.string(),
          }),
          response: {
            401: z.object({
              error: z.string(),
            }),
            403: z.object({
              error: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      )
      .put(
        "/:id",
        async ({ body, set, params, user }) => {
          try {
            await deckService.updateDeck(body, params.id, user.id);
            set.status = 204;
          } catch (error: unknown) {
            if (error instanceof HttpError) {
              set.status = error.status;
              return { error: error.message };
            }
            if (error instanceof Error) {
              set.status = 500;
              return { error: error.message };
            }
            set.status = 500;
            return { error: "An unexpected error occurred" };
          }
        },
        {
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            name: z
              .string()
              .max(100, "Name must be at most 100 characters long")
              .min(1, "Name must be at least 1 character long"),
            description: z
              .string()
              .max(500, "Description must be at most 500 characters long")
              .min(1, "Description must be at least 1 character long"),
          }),
          response: {
            401: z.object({
              error: z.string(),
            }),
            403: z.object({
              error: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      )
      .group("/:id/cards", (app) =>
        app
          .get(
            "/",
            async ({ params, user, set }) => {
              try {
                const deckWithCards = await cardService.findByDeckId<DeckWithCardsResponse>(
                  params.id,
                  user.id,
                );

                if (!deckWithCards) {
                  set.status = 404;
                  return { error: "Deck not found or access denied" };
                }

                return {
                  deckId: deckWithCards.deckId,
                  deckName: deckWithCards.deckName,
                  cards: deckWithCards.cards.map((card) => ({
                    ...card,
                    createdAt: card.createdAt.toISOString(),
                    updatedAt: card.updatedAt.toISOString(),
                  })),
                };
              } catch (error: unknown) {
                if (error instanceof HttpError) {
                  set.status = error.status;
                  return { error: error.message };
                }
                if (error instanceof Error) {
                  return { error: error.message };
                }
                return { error: "An unexpected error occurred" };
              }
            },
            {
              params: z.object({
                id: z.string(),
              }),
              response: {
                200: z.object({
                  deckId: z.string(),
                  deckName: z.string(),
                  cards: z.array(
                    z.object({
                      cardId: z.string(),
                      deckId: z.string(),
                      front: z.string(),
                      back: z.string(),
                      createdAt: z.string().datetime(),
                      updatedAt: z.string().datetime(),
                      reviewCount: z.number(),
                    }),
                  ),
                }),
                401: z.object({
                  error: z.string(),
                }),
                404: z.object({
                  error: z.string(),
                }),
                500: z.object({
                  error: z.string(),
                }),
              },
            },
          )
          .post(
            "/",
            async ({ body, params, user, set }) => {
              try {
                await deckService.getDeckById(params.id, user.id);
                const result = await cardService.create({
                  ...body,
                  deckId: params.id,
                });
                return result;
              } catch (error: unknown) {
                if (error instanceof HttpError) {
                  set.status = error.status;
                  return { error: error.message };
                }
                if (error instanceof Error) {
                  return { error: error.message };
                }
                return { error: "An unexpected error occurred" };
              }
            },
            {
              body: z.object({
                front: z.string(),
                back: z.string(),
              }),
              params: z.object({
                id: z.string(),
              }),
            },
          ),
      ),
  );
