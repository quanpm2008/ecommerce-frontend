import { useCallback, useEffect, useState } from 'react'

/**
 * Tiny stand-in for TanStack Query's useQuery, for the preview only.
 * The real integration would call useQuery({ queryKey, queryFn }) instead.
 */
export function useMockQuery<T>(key: string, fn: () => Promise<T>) {
  const [state, setState] = useState<{ key: string; data?: T; error?: string; loading: boolean }>({ key, loading: true })
  const [attempt, setAttempt] = useState(0)

  // New key → back to loading (keeps previous data like keepPreviousData would not; simpler).
  if (state.key !== key) setState({ key, loading: true })

  useEffect(() => {
    let cancelled = false
    fn().then(
      (data) => !cancelled && setState({ key, data, loading: false }),
      (error: Error) => !cancelled && setState({ key, error: error.message, loading: false }),
    )
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key identifies the request
  }, [key, attempt])

  const retry = useCallback(() => {
    setState({ key, loading: true })
    setAttempt((n) => n + 1)
  }, [key])

  return { data: state.data, error: state.error, loading: state.loading, retry }
}
