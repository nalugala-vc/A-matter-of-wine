import apiClient from '../../../lib/api'
import { Story, StoryListApiResponse, StoryApiResponse, transformStory } from '../types'

export interface GetStoriesParams {
  page?: number
  pageSize?: number
}

export interface GetStoriesResult {
  stories: Story[]
  total: number
  page: number
  pageSize: number
}

export async function getStories(params: GetStoriesParams = {}): Promise<GetStoriesResult> {
  const { page = 1, pageSize = 20 } = params
  
  const response = await apiClient.get<StoryListApiResponse>('/stories', {
    params: {
      page,
      page_size: pageSize,
    },
  })
  
  return {
    stories: response.data.stories.map(transformStory),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getStory(storyId: string): Promise<Story> {
  const response = await apiClient.get<StoryApiResponse>(`/stories/${storyId}`)
  return transformStory(response.data)
}
