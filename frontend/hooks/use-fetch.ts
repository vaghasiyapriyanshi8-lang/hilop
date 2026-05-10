import { useCallback, useState } from 'react'

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseFetchOptions {
  skip?: boolean
}

export function useFetch<T>(
  fn: () => Promise<T>,
  options?: UseFetchOptions
) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const data = await fn()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      })
    }
  }, [fn])

  return { ...state, refetch }
}