import type { UserComment } from "./features/comments/types";
import type { UserReply } from "./features/replies/types";

export const incrementScore = (entity: UserComment | UserReply, currentScore: number) =>
    entity.score = currentScore === entity.score ? entity.score + 1 : entity.score < currentScore ? entity.score + 2 : currentScore

export const decrementScore = (entity: UserComment | UserReply, currentScore: number) =>
    entity.score = currentScore === entity.score ? entity.score - 1 : entity.score > currentScore ? entity.score - 2 : currentScore