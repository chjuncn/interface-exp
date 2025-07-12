'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Reply, Trash2, Edit3 } from 'lucide-react'

interface Comment {
  id: string
  elementId: string
  elementType: 'array-item' | 'control' | 'timeline' | 'general'
  position: { x: number; y: number }
  text: string
  author: string
  timestamp: Date
  replies: Reply[]
}

interface Reply {
  id: string
  text: string
  author: string
  timestamp: Date
}

interface CommentSystemProps {
  isActive: boolean
  onAddComment: (comment: Comment) => void
  comments: Comment[]
  onUpdateComment: (commentId: string, text: string) => void
  onDeleteComment: (commentId: string) => void
  onAddReply: (commentId: string, reply: Reply) => void
  isAddingComment: boolean
  setIsAddingComment: (value: boolean) => void
  selectedElement: string | null
  setSelectedElement: (element: string | null) => void
}

export default function CommentSystem({
  isActive,
  onAddComment,
  comments,
  onUpdateComment,
  onDeleteComment,
  onAddReply,
  isAddingComment,
  setIsAddingComment,
  selectedElement,
  setSelectedElement
}: CommentSystemProps) {
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [showComments, setShowComments] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const commentsPanelRef = useRef<HTMLDivElement>(null)

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isActive || !isAddingComment) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find the closest element
    const target = e.target as HTMLElement
    let elementId = 'general'
    let elementType: Comment['elementType'] = 'general'

    if (target.closest('[data-array-item]')) {
      elementId = target.closest('[data-array-item]')?.getAttribute('data-array-item') || 'array-item'
      elementType = 'array-item'
    } else if (target.closest('[data-control]')) {
      elementId = target.closest('[data-control]')?.getAttribute('data-control') || 'control'
      elementType = 'control'
    } else if (target.closest('[data-timeline]')) {
      elementId = target.closest('[data-timeline]')?.getAttribute('data-timeline') || 'timeline'
      elementType = 'timeline'
    }

    // Set the selected element and ensure the comments panel slides out
    setSelectedElement(elementId)
    setIsAddingComment(false)
    
    // Force the comments panel to show with a slight delay to ensure smooth animation
    setTimeout(() => {
      setShowComments(true)
    }, 50)
  }

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedElement) return

    const newComment: Comment = {
      id: Date.now().toString(),
      elementId: selectedElement,
      elementType: 'array-item', // This would be determined by the selected element
      position: { x: 0, y: 0 }, // This would be the actual position
      text: commentText,
      author: 'User', // In a real app, this would be the logged-in user
      timestamp: new Date(),
      replies: []
    }

    onAddComment(newComment)
    setCommentText('')
    setSelectedElement(null)
  }

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return

    const newReply: Reply = {
      id: Date.now().toString(),
      text: replyText,
      author: 'User',
      timestamp: new Date()
    }

    onAddReply(commentId, newReply)
    setReplyText('')
    setReplyingTo(null)
  }

  const handleUpdateComment = (commentId: string) => {
    if (!commentText.trim()) return
    onUpdateComment(commentId, commentText)
    setCommentText('')
    setEditingComment(null)
  }

  // Handle click outside to close comments panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showComments &&
        commentsPanelRef.current &&
        !commentsPanelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-comment-toggle]')
      ) {
        setShowComments(false)
        setSelectedElement(null)
        setCommentText('')
        setReplyingTo(null)
        setEditingComment(null)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showComments) {
        setShowComments(false)
        setSelectedElement(null)
        setCommentText('')
        setReplyingTo(null)
        setEditingComment(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [showComments, setSelectedElement])

  return (
    <>
      {/* Comment Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!showComments) {
            // If panel is closed, open it and enter add mode
            setShowComments(true)
            setIsAddingComment(true)
          } else if (!isAddingComment) {
            // If panel is open but not in add mode, enter add mode
            setIsAddingComment(true)
          } else {
            // If already in add mode, just close the panel
            setShowComments(false)
            setIsAddingComment(false)
            setSelectedElement(null)
          }
        }}
        data-comment-toggle
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-colors z-40 flex items-center justify-center ${
          isAddingComment 
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white animate-pulse' 
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
        {comments.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {comments.length}
          </span>
        )}
      </motion.button>

      {/* Add Comment Mode Indicator */}
      <AnimatePresence>
        {isAddingComment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Click on any element to add a comment
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            ref={commentsPanelRef}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddingComment(true)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Add comment"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowComments(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No comments yet</p>
                  <p className="text-sm text-gray-400">Click the + button to add a comment</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-primary-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {comment.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Comment Content */}
                    {editingComment === comment.id ? (
                      <div className="mb-2">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                          rows={2}
                          placeholder="Edit comment..."
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            className="px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 mb-2">{comment.text}</p>
                    )}

                    {/* Element Info */}
                    <div className="text-xs text-gray-500 mb-2">
                      On: {comment.elementType} #{comment.elementId}
                    </div>

                    {/* Reply Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </motion.button>

                    {/* Reply Input */}
                    <AnimatePresence>
                      {replyingTo === comment.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                            rows={2}
                            placeholder="Write a reply..."
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAddReply(comment.id)}
                              className="px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => setReplyingTo(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="ml-4 pl-3 border-l-2 border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-2 h-2 text-gray-600" />
                              </div>
                              <span className="text-xs font-medium text-gray-900">{reply.author}</span>
                              <span className="text-xs text-gray-500">
                                {reply.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            {selectedElement && (
              <div className="p-4 border-t border-gray-200">
                <div className="mb-2">
                  <span className="text-xs text-gray-500">
                    Commenting on: {selectedElement}
                  </span>
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  placeholder="Write your comment..."
                />
                <div className="flex gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    <Send className="w-4 h-4 inline mr-1" />
                    Add Comment
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedElement(null)
                      setCommentText('')
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 