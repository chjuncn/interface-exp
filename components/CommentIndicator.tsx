'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface CommentIndicatorProps {
  elementId: string
  commentCount: number
  onClick: () => void
}

export default function CommentIndicator({ elementId, commentCount, onClick }: CommentIndicatorProps) {
  if (commentCount === 0) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-red-600 transition-colors z-10"
      title={`${commentCount} comment${commentCount > 1 ? 's' : ''}`}
    >
      <MessageCircle className="w-3 h-3" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-500 text-xs rounded-full flex items-center justify-center font-bold">
        {commentCount}
      </span>
    </motion.div>
  )
} 