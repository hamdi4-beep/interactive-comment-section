# 🧱 Comment Section – Architecture & Data Model

This document provides a comprehensive overview of the architecture, data model, and component responsibilities of the interactive comment section. It is written for maintainers, contributors, and future developers who need to understand how the system behaves, how state flows, and what data contracts are required.

---

## 🧭 Overview

This application renders an interactive comment thread from structured JSON data. Users can:

- Add top-level comments
- Add replies to comments or other replies
- Edit their own comments/replies
- Delete their own comments/replies

All interactions are handled through a single reducer, powered by React’s `useReducer`, and structured for maintainability and scalability.

> ⚠️ **Important**: The system currently runs entirely on mock data. Persistence and backend integration are planned but not yet implemented.

---

## 🧩 Data Model

### 🔶 User Object

```ts
type User = {
  username: string
  image: {
    png: string
    webp: string
  }
}
```

### 🔷 Comment Object

```ts
type UserComment = {
    id: string
    createdAt: string
    score: number
    content: string
    user: string
    replies: UserComment['id'][]
}
```

### 🔷 Reply Object

```ts
type UserReply = {
  id: string
  content: string
  createdAt: string
  score: number
  user: User
  replyingTo: string // username
  parentId: string   // ID of the parent comment
}
```

> ⚠️ `id` must be globally unique across both comments and replies.

---

## 📦 Reducers & Actions

### 🟢 `commentCreated(content: string)`

Creates a new top-level comment.

- Generates a unique `commentId` using `nanoid()`
- Sets initial score to `0`
- Sets `createdAt` to `"now"` (placeholder)
- Assigns user from `data.currentUser`
- Initializes `replies` as an empty array

### 🟡 `commentEdited({ commentId, content })`

Updates the `content` of an existing comment.

- Requires valid `commentId`
- No error handling for nonexistent ID

### 🔴 `commentDeleted({ commentId })`

Deletes a comment by ID.

- Removes the comment from both `byId` and `allId`
- Does **not** cascade delete related replies (replies must be deleted separately)

### 🔵 `commentScoreUpdated({ commentId, score })`

Sets the new `score` for a given comment.

- Overwrites previous score
- No validation logic

---

## 🔄 Extra Reducers

These handle reply events dispatched from `RepliesSlice`.

### ✅ `replyCreated({ parentCommentId, replyId })`

Adds the new `replyId` to the `replies` array of the parent comment.

- Checks if `parentCommentId` exists in `state.allId` before proceeding

### ❌ `replyDeleted({ parentCommentId, replyId })`

Removes `replyId` from the `replies` array of the associated parent comment.

- Only mutates the `replies` array; the actual reply object is deleted in `RepliesSlice`

> All actions assume valid IDs and sanitized payloads. No runtime schema validation is implemented (yet).

---

## 🧠 State Management

- State is managed via Redux using dispatchers
- Only the reducer modifies data—there is no state mutation inside components
- Components consume state by selecting data via ID (not entire objects)

---

## 🧱 Component Responsibility

### 📍 `App.tsx`
- Entry point only. Does **not** hold state or logic.
- Delegates to `CommentSection`.

---

### 🧠 `CommentSection.tsx`
- Houses the reducer and context provider.
- Responsible for:
  - Initializing data
  - Rendering the list of comments + root-level form

---

### 📃 `CommentsList.tsx`
- Grabs all top-level comment IDs.
- Renders a `Comment` for each one by passing in its ID.

---

### 🧾 `Comment.tsx`
- Selects the full comment object by its ID.
- Renders:
  - `Card` (visual structure)
  - List of `Reply` components (if any)
  - Comment-specific interaction logic (edit, delete, reply)

---

### 💬 `Reply.tsx`
- Mirrors the `Comment` component.
- Selects reply object by ID.
- Owns logic for replying to a reply or editing/deleting one.

---

### 📦 `Card.tsx`
- Presentational only.
- Receives a comment or reply object and renders it visually.
- **Does not know** whether it’s rendering a comment or a reply.
- Owns shared layout (score display, avatar, metadata).

> Note: Card should not handle logic. All behavior is abstracted away into the calling `Comment` or `Reply` component.

---

### 📝 `FormComponent.tsx`
- Reusable form for both replies and comments.
- Accepts a `dispatchHandler(content: string)` prop.
- Can optionally accept a `defaultValue` for editing.

---

## 📈 Next Steps

- Add `zod` or runtime validator for `data.json`
- Memoize `Comment` and `Reply` to avoid deep re-renders
- Introduce `commentService.ts` for persistence abstraction
- Add input validation and submission debouncing
- Document full reducer contract in `reducers/reducer.ts`