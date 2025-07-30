# Chat System Test Checklist

## Setup
- [ ] Run database migration: `chat-system-migration.sql`
- [ ] Compile backend: `mvn clean compile`
- [ ] Install frontend dependencies: `npm install`

## Test Cases
- [ ] User search functionality
- [ ] Real-time messaging
- [ ] Message deletion
- [ ] Online status
- [ ] Chat history persistence

## Expected Behavior
- Users can search for other users
- Messages send and receive in real-time
- Deleted messages show "User deleted message"
- Online/offline status updates correctly
- Chat history is preserved 