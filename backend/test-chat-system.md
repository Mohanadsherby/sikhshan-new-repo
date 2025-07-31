# Chat System Test Plan

## Prerequisites
1. Backend server running on port 8081
2. Frontend server running on port 3000
3. Database with chat tables created
4. At least 2 users (student and faculty) in the system

## Test Steps

### 1. Database Setup
```sql
-- Run the chat system migration
mysql -u root -p sikhshan_db < backend/src/main/resources/chat-system-migration.sql
```

### 2. Backend Compilation
```bash
cd backend
mvn clean compile
```

### 3. Frontend Dependencies
```bash
cd frontend
npm install
```

### 4. Test Scenarios

#### A. User Search
1. Login as a student
2. Navigate to Chat
3. Click "New Message" button
4. Search for faculty users
5. Verify suggested users (course instructors) appear
6. Select a user to start chat

#### B. Real-time Messaging
1. Login as two different users in separate browsers
2. Start a chat between them
3. Send messages from both sides
4. Verify real-time message delivery
5. Check message timestamps

#### C. Message Deletion
1. Send a message
2. Delete the message
3. Verify "User deleted message" appears
4. Check that other user sees the deletion

#### D. Online Status
1. Login as user A
2. Login as user B in another browser
3. Verify online status indicators
4. Logout user A and check offline status

#### E. Chat History
1. Send multiple messages
2. Refresh the page
3. Verify message history is preserved
4. Check message ordering

## Expected Results

### User Search
- ✅ Search by name/email works
- ✅ Role filtering works
- ✅ Suggested users appear for students (course instructors)
- ✅ Current user is excluded from results

### Real-time Messaging
- ✅ Messages appear instantly
- ✅ WebSocket connection status shows
- ✅ Message timestamps are correct
- ✅ Message content is preserved

### Message Deletion
- ✅ Deleted messages show "User deleted message"
- ✅ Deletion is synchronized across users
- ✅ Message history is maintained

### Online Status
- ✅ Online/offline indicators work
- ✅ Status updates in real-time
- ✅ Last seen timestamps are accurate

### Chat History
- ✅ Messages persist after page refresh
- ✅ Correct message ordering
- ✅ All message metadata preserved

## Troubleshooting

### Common Issues
1. **WebSocket Connection Failed**
   - Check backend WebSocket configuration
   - Verify CORS settings
   - Check browser console for errors

2. **User Search Not Working**
   - Verify database migration ran successfully
   - Check user data exists in database
   - Verify repository methods are working

3. **Messages Not Sending**
   - Check WebSocket connection status
   - Verify chat room creation
   - Check backend logs for errors

4. **Online Status Not Updating**
   - Check WebSocket event listeners
   - Verify user status table exists
   - Check connection/disconnection events

## Performance Considerations
- Message delivery should be < 1 second
- Search results should load in < 2 seconds
- WebSocket reconnection should be automatic
- Large message history should be paginated 