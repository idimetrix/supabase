import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { get } from 'data/fetchers'
import { useCallback } from 'react'
import { configKeys } from './keys'

export type ProjectPostgrestConfigVariables = {
  projectRef?: string
}

export async function getProjectPostgrestConfig(
  { projectRef }: ProjectPostgrestConfigVariables,
  signal?: AbortSignal
) {
  if (!projectRef) {
    throw new Error('projectRef is required')
  }

  const { error, data } = await get('/platform/projects/{ref}/config/postgrest', {
    params: { path: { ref: projectRef } },
    signal,
  })
  if (error) throw error

  return data
}

export type ProjectPostgrestConfigData = Awaited<ReturnType<typeof getProjectPostgrestConfig>>
export type ProjectPostgrestConfigError = unknown

export const useProjectPostgrestConfigQuery = <TData = ProjectPostgrestConfigData>(
  { projectRef }: ProjectPostgrestConfigVariables,
  {
    enabled = true,
    ...options
  }: UseQueryOptions<ProjectPostgrestConfigData, ProjectPostgrestConfigError, TData> = {}
) =>
  useQuery<ProjectPostgrestConfigData, ProjectPostgrestConfigError, TData>(
    configKeys.postgrest(projectRef),
    ({ signal }) => getProjectPostgrestConfig({ projectRef }, signal),
    {
      enabled: enabled && typeof projectRef !== 'undefined',
      ...options,
    }
  )

export const useProjectPostgrestConfigPrefetch = ({
  projectRef,
}: ProjectPostgrestConfigVariables) => {
  const client = useQueryClient()

  return useCallback(() => {
    if (projectRef) {
      client.prefetchQuery(configKeys.postgrest(projectRef), ({ signal }) =>
        getProjectPostgrestConfig({ projectRef }, signal)
      )
    }
  }, [projectRef])
}
