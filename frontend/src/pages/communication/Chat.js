"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../contexts/AuthContext"

function Chat() {
  const { currentUser } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef(null)

  // Mock chats data
  const [chats, setChats] = useState([
    {
      id: 1,
      type: "private",
      name: "Dr. Smith",
      role: "FACULTY",
      avatar: "S",
      lastMessage: "Can you please submit your assignment by tomorrow?",
      lastMessageTime: "10:30 AM",
      unread: 2,
      messages: [
        {
          id: 1,
          sender: "Dr. Smith",
          text: "Hello, how are you doing with the assignment?",
          time: "10:15 AM",
          isSelf: false,
        },
        {
          id: 2,
          sender: "Dr. Smith",
          text: "Just checking in as the deadline is approaching.",
          time: "10:20 AM",
          isSelf: false,
        },
        {
          id: 3,
          sender: "Dr. Smith",
          text: "Can you please submit your assignment by tomorrow?",
          time: "10:30 AM",
          isSelf: false,
        },
      ],
    },
    {
      id: 2,
      type: "group",
      name: "CS101 Study Group",
      members: ["You", "John", "Sarah", "Mike", "Emily"],
      avatar: "CS",
      lastMessage: "I think we should meet on Saturday to prepare for the exam.",
      lastMessageTime: "Yesterday",
      unread: 5,
      messages: [
        {
          id: 1,
          sender: "John",
          text: "Hey everyone, how are you preparing for the exam?",
          time: "Yesterday, 2:15 PM",
          isSelf: false,
        },
        {
          id: 2,
          sender: "Sarah",
          text: "I'm going through the lecture notes and practice problems.",
          time: "Yesterday, 2:20 PM",
          isSelf: false,
        },
        {
          id: 3,
          sender: "Mike",
          text: "Same here. The practice problems are quite challenging.",
          time: "Yesterday, 2:25 PM",
          isSelf: false,
        },
        {
          id: 4,
          sender: "Emily",
          text: "I think we should meet on Saturday to prepare for the exam.",
          time: "Yesterday, 2:30 PM",
          isSelf: false,
        },
      ],
    },
    {
      id: 3,
      type: "private",
      name: "Academic Advisor",
      role: "Staff",
      avatar: "A",
      lastMessage: "Your course registration for next semester has been approved.",
      lastMessageTime: "2 days ago",
      unread: 0,
      messages: [
        {
          id: 1,
          sender: "Academic Advisor",
          text: "Hello, I wanted to discuss your course selection for next semester.",
          time: "2 days ago, 9:15 AM",
          isSelf: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Hi, I've selected CS201, MATH202, and PHYS101.",
          time: "2 days ago, 9:20 AM",
          isSelf: true,
        },
        {
          id: 3,
          sender: "Academic Advisor",
          text: "That looks good. I've reviewed your academic progress and these courses align well with your program.",
          time: "2 days ago, 9:25 AM",
          isSelf: false,
        },
        {
          id: 4,
          sender: "Academic Advisor",
          text: "Your course registration for next semester has been approved.",
          time: "2 days ago, 9:30 AM",
          isSelf: false,
        },
      ],
    },
  ])

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChat])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!message.trim()) return

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    }

    // Update the selected chat with the new message
    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message,
          lastMessageTime: "Just now",
        }
      }
      return chat
    })

    setChats(updatedChats)
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      lastMessage: message,
      lastMessageTime: "Just now",
    })
    setMessage("")
  }

  // Filter chats based on search term
  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Mark chat as read when selected
  const handleSelectChat = (chat) => {
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 }
      }
      return c
    })

    setChats(updatedChats)
    setSelectedChat({ ...chat, unread: 0 })
  }

  const chatContent = (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="overflow-y-auto h-[calc(100%-64px)]">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? "bg-red-50" : ""
                    }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-500 text-white">
                          {chat.avatar}
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="w-2/3 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-500 text-white">
                      {selectedChat.avatar}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{selectedChat.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedChat.type === "private" ? selectedChat.role : `${selectedChat.members.length} members`}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {selectedChat.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.isSelf ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {!msg.isSelf && selectedChat.type === "group" && (
                            <p className="text-xs font-medium mb-1">{msg.sender}</p>
                          )}
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 text-right ${msg.isSelf ? "text-red-200" : "text-gray-500"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a conversation from the list to start chatting.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (!currentUser) return null
  return chatContent
}

export default Chat
