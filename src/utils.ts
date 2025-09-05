import type { CommentState, UserComment, CommentID } from "@/features/comment/types";
import type { UserReply } from "@/features/reply/types";

type Item = UserComment | UserReply

export const incrementScore = (item: Item, currentScore: number) =>
    // Updates the score by two to skip the current score because upvoting is only meant to increase the current value by one
    item.score = currentScore === item.score ?
        item.score + 1 : item.score < currentScore ? item.score + 2 : currentScore

export const decrementScore = (item: Item, currentScore: number) =>
    // Updates the score by two to skip the current score because upvoting is only meant to decrease the current value by one
    item.score = currentScore === item.score ?
        item.score - 1 : item.score > currentScore ? item.score - 2 : currentScore

export const findCommentById = (state: CommentState, targetId: CommentID) => {
    try {
        const comment = state.byId[targetId]
        if (!comment) throw new Error(`A comment with an ID of ${targetId} does not exist`)
        return comment
    } catch (err) {
        console.error(err)
    }
}