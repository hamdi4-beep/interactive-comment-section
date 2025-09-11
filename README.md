# Interactive Comment Section

A React-based interactive comment system built with TypeScript and Redux Toolkit, featuring nested replies, scoring, and user management.

## Architecture Overview

The application follows a feature-based architecture with Redux for state management, implementing a normalized data structure for efficient comment and reply handling.

### Core Technologies

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **CSS3** with custom properties for theming
- **Vite** as build tool

## Feature Structure

The codebase is organized around three main features:

### 1. Comments (`/features/comment/`)

**Types:**
```typescript
type UserComment = {
    id: string
    createdAt: string
    score: number
    content: string
    username: string
    replies: UserComment['id'][]
}
```

**Key Components:**
- `Comment.tsx` - Main comment display component
- `CommentsSlice.ts` - Redux slice managing comment state
- Handles CRUD operations and score updates

**State Management:**
- Normalized structure with `byId` and `allId` patterns
- Automatic ID generation using `nanoid()`
- Cross-slice communication for reply management

### 2. Replies (`/features/reply/`)

**Types:**
```typescript
type UserReply = Omit<UserComment, 'replies'> & {
    replyingTo: string,
    parentCommentId: UserComment['id']
}
```

**Key Features:**
- Nested reply system with parent-child relationships
- Score reset functionality on component unmount
- Reply-to-reply threading support

### 3. Users (`/features/user/`)

**Management:**
- Current user identification
- Avatar and username display
- User-specific action permissions

## Component Architecture

### Core Components (`/components/`)

**Card.tsx** - Universal container component
- Handles both comments and replies
- Manages local UI states (editing, replying, modal)
- Props-based event handling for Redux actions

**FormComponent.tsx** - Unified form handling
- Supports both creation and editing modes
- Auto-focus functionality
- Form validation and submission

**CommentsList.tsx** - Comment rendering orchestrator
- ID-based rendering for performance
- Memoized components to prevent unnecessary re-renders

## State Management

### Redux Store Structure

```typescript
{
  comments: {
    byId: Record<CommentID, UserComment>,
    allId: CommentID[]
  },
  replies: {
    byId: Record<ReplyID, UserReply>,
    allId: ReplyID[]
  },
  users: {
    currentUser: User,
    byUsername: Record<string, User>,
    allUsername: string[]
  }
}
```

### Key Patterns

**Normalized Data:**
- Entities stored by ID for O(1) lookups
- Separate arrays maintain order
- Prevents data duplication and synchronization issues

**Cross-Slice Communication:**
- `extraReducers` handle actions from other slices
- Comment deletion automatically updates reply references
- Reply creation updates parent comment's reply array

**Optimistic Updates:**
- Immediate UI feedback for score changes
- Background validation prevents invalid states

## Scoring System

Implements Reddit-style voting with optimistic updates:

```typescript
const incrementScore = (item: Item, currentScore: number) =>
    item.score = currentScore === item.score ?
        item.score + 1 : item.score < currentScore ? item.score + 2 : currentScore
```

**Logic:**
- Single click increments by 1
- Prevents double-voting through state comparison
- Handles race conditions with server synchronization

## UI/UX Features

### Responsive Design
- Mobile-first approach with breakpoint at 768px
- Desktop: Horizontal layout with side scoring
- Mobile: Vertical stacking with bottom actions

### Interactive Elements
- Modal confirmations for destructive actions
- Inline editing with pre-populated content
- Collapsible reply threads
- Visual current user indicators

### Theming
CSS custom properties enable consistent theming:
```css
:root {
  --primary-purple-600: hsl(238, 40%, 52%);
  --neutral-grey-800: hsl(212, 24%, 26%);
  /* ... */
}
```

## Performance Optimizations

**React.memo Usage:**
- `Card`, `Comment`, and `Reply` components memoized
- Prevents cascading re-renders on state updates

**Callback Optimization:**
- `useCallback` for event handlers passed to children
- Stable references prevent unnecessary re-renders

**Selective Re-rendering:**
- ID-based selectors limit update scope
- Normalized state prevents deep object updates

## Data Flow

1. **User Action** → Component event handler
2. **Event Handler** → Redux action dispatch
3. **Redux Action** → Reducer state update
4. **State Update** → Component re-render via selector
5. **Component Update** → UI reflects new state

### Example: Adding a Reply

```typescript
// 1. User submits form
const createReplyHandler = useCallback(
    (content: string) =>
        dispatch(replyCreated(content, currentUser.username, comment.username, id)),
    [comment.username, id]
)

// 2. Action creator generates payload
prepare: (content, username, replyingTo, parentCommentId) => ({
    payload: {
        content,
        id: nanoid(),
        username,
        replyingTo,
        parentCommentId,
        createdAt: new Date().toISOString()
    }
})

// 3. Reply slice creates new reply
// 4. Comment slice adds reply ID to parent's replies array (extraReducers)
// 5. Components re-render with new data
```

## Error Handling

**Error Boundaries:**
- Top-level error boundary catches component errors
- Custom fallback component displays error information

**Runtime Validation:**
- Entity existence checks with meaningful error messages
- Graceful degradation for missing data

## Testing Strategy

The codebase includes unit testing setup:
- Jest configuration for computational functions
- Component testing patterns established
- Redux action and reducer testing ready

## Development Considerations

**Type Safety:**
- Strict TypeScript configuration
- Typed Redux hooks and selectors
- Comprehensive interface definitions

**Code Organization:**
- Feature-based folder structure
- Clear separation of concerns
- Consistent naming conventions

**Scalability:**
- Normalized data structure supports large datasets
- Memoization prevents performance degradation
- Modular architecture enables feature additions

## Deployment

The application uses Vite for development and build processes:
- Hot module replacement for development
- Optimized production builds
- Static asset handling for images

## 🔮 Future Enhancements

The modular architecture enables independent feature evolution:

**Comment-Specific Features:**
- 📌 Comment pinning and highlighting
- 🏆 Award systems and badges  
- 📁 Comment categorization and tagging
- 💾 Draft saving and templates
- 📊 Advanced analytics and insights

**Reply-Specific Features:**  
- ⏱️ Auto-expiring replies
- 🔒 Private reply threads
- 📝 Reply character limits
- 🎯 Contextual reply suggestions
- 📱 Reply-only mobile notifications

**Shared Infrastructure:**
- 🔄 Real-time updates via WebSocket integration
- 📄 Pagination for large comment threads  
- ✏️ Rich text editing capabilities
- 🔐 User authentication integration

**Architecture Benefits:**
Each feature can be developed, tested, and deployed independently without risk of breaking the other, demonstrating the power of proper separation of concerns.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React patterns and Redux Toolkit
- Responsive design inspired by contemporary comment systems
- TypeScript integration for enhanced developer experience
