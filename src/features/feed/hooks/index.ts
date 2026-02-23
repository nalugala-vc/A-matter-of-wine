import { useState, useEffect, useCallback } from 'react'
import { Post, Comment } from '../types'
import {
  getFeed,
  getExplore,
  createPost,
  uploadPostImages,
  deletePost,
  likePost,
  unlikePost,
  getComments,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
  CreatePostData,
  GetPostsParams,
} from '../services'

interface UseFeedState {
  posts: Post[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
}

export function useFeed(mode: 'feed' | 'explore' = 'feed') {
  const [state, setState] = useState<UseFeedState>({
    posts: [],
    total: 0,
    page: 1,
    pageSize: 20,
    loading: true,
    error: null,
  })

  const fetchPosts = useCallback(async (params: GetPostsParams = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const fetcher = mode === 'feed' ? getFeed : getExplore
      const result = await fetcher({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      })
      setState(prev => ({
        posts: params.page && params.page > 1
          ? [...prev.posts, ...result.posts]
          : result.posts,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        loading: false,
        error: null,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch posts',
      }))
    }
  }, [mode])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const loadMore = () => {
    if (state.posts.length < state.total) {
      fetchPosts({ page: state.page + 1 })
    }
  }

  const addPost = async (data: CreatePostData, images?: File[]): Promise<Post> => {
    let post = await createPost(data)
    if (images && images.length > 0) {
      post = await uploadPostImages(post.id, images)
    }
    // Prepend to list
    setState(prev => ({
      ...prev,
      posts: [post, ...prev.posts],
      total: prev.total + 1,
    }))
    return post
  }

  const removePost = async (postId: string) => {
    await deletePost(postId)
    setState(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p.id !== postId),
      total: prev.total - 1,
    }))
  }

  const toggleLike = async (postId: string) => {
    const post = state.posts.find(p => p.id === postId)
    if (!post) return

    try {
      const result = post.likedByMe
        ? await unlikePost(postId)
        : await likePost(postId)

      setState(prev => ({
        ...prev,
        posts: prev.posts.map(p =>
          p.id === postId
            ? { ...p, likedByMe: !p.likedByMe, likesCount: result.likesCount }
            : p
        ),
      }))
    } catch {
      // Silently fail on duplicate like/unlike
    }
  }

  return {
    ...state,
    refetch: () => fetchPosts(),
    loadMore,
    hasMore: state.posts.length < state.total,
    addPost,
    removePost,
    toggleLike,
  }
}

interface UseCommentsState {
  comments: Comment[]
  total: number
  loading: boolean
  error: string | null
}

export function useComments(postId: string | null) {
  const [state, setState] = useState<UseCommentsState>({
    comments: [],
    total: 0,
    loading: false,
    error: null,
  })

  const fetchComments = useCallback(async () => {
    if (!postId) return
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await getComments(postId)
      setState({
        comments: result.comments,
        total: result.total,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch comments',
      }))
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const addComment = async (content: string): Promise<Comment | undefined> => {
    if (!postId) return
    const comment = await createComment(postId, content)
    setState(prev => ({
      ...prev,
      comments: [...prev.comments, comment],
      total: prev.total + 1,
    }))
    return comment
  }

  const removeComment = async (commentId: string) => {
    await deleteComment(commentId)
    setState(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c.id !== commentId),
      total: prev.total - 1,
    }))
  }

  const toggleCommentLike = async (commentId: string) => {
    const comment = state.comments.find(c => c.id === commentId)
    if (!comment) return

    try {
      const result = comment.likedByMe
        ? await unlikeComment(commentId)
        : await likeComment(commentId)

      setState(prev => ({
        ...prev,
        comments: prev.comments.map(c =>
          c.id === commentId
            ? { ...c, likedByMe: !c.likedByMe, likesCount: result.likesCount }
            : c
        ),
      }))
    } catch {
      // Silently fail
    }
  }

  return {
    ...state,
    refetch: fetchComments,
    addComment,
    removeComment,
    toggleCommentLike,
  }
}
