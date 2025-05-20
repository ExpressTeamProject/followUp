import { kyInstance } from '@/lib/kyInstance'
import { RestApiResponse } from '@/models/ApiCommon'
import { Comment } from '@/models/Comment'
import { useQuery } from '@tanstack/react-query'

const getCommentByProblemId = async (problemId: string) => {
  const response = (await kyInstance.get(`comments/post/${problemId}`))
  const data = await response.json() as RestApiResponse<Comment[]>
  return data.data
}

function useCommentByProblemIdQuery(problemId: string) {
  return useQuery({ queryFn: () => getCommentByProblemId(problemId), queryKey: ['commentByProblemId', problemId] })
}

export default useCommentByProblemIdQuery
