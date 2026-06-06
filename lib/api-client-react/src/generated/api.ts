/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  ErrorResponse,
  HealthStatus,
  Message,
  MessageCount,
  MessageInput
} from './api.schemas';

import { customFetch } from '../custom-fetch';
import type { ErrorType , BodyType } from '../custom-fetch';

type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getHealthCheckUrl = () => {




  return `/api/healthz`
}

/**
 * Returns server health status
 * @summary Health check
 */
export const healthCheck = async ( options?: RequestInit): Promise<HealthStatus> => {

  return customFetch<HealthStatus>(getHealthCheckUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getHealthCheckQueryKey = () => {
    return [
    `/api/healthz`
    ] as const;
    }


export const getHealthCheckQueryOptions = <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthCheckQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) => healthCheck({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & { queryKey: QueryKey }
}

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>
export type HealthCheckQueryError = ErrorType<unknown>


/**
 * @summary Health check
 */

export function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getHealthCheckQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCreateMessageUrl = () => {




  return `/api/messages`
}

/**
 * @summary Submit a visitor message
 */
export const createMessage = async (messageInput: MessageInput, options?: RequestInit): Promise<Message> => {

  return customFetch<Message>(getCreateMessageUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(messageInput)
  }
);}




export const getCreateMessageMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createMessage>>, TError,{data: BodyType<MessageInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createMessage>>, TError,{data: BodyType<MessageInput>}, TContext> => {

const mutationKey = ['createMessage'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createMessage>>, {data: BodyType<MessageInput>}> = (props) => {
          const {data} = props ?? {};

          return  createMessage(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateMessageMutationResult = NonNullable<Awaited<ReturnType<typeof createMessage>>>
    export type CreateMessageMutationBody = BodyType<MessageInput>
    export type CreateMessageMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Submit a visitor message
 */
export const useCreateMessage = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createMessage>>, TError,{data: BodyType<MessageInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof createMessage>>,
        TError,
        {data: BodyType<MessageInput>},
        TContext
      > => {
      return useMutation(getCreateMessageMutationOptions(options));
    }

export const getGetMessageCountUrl = () => {




  return `/api/messages/count`
}

/**
 * @summary Get total message count
 */
export const getMessageCount = async ( options?: RequestInit): Promise<MessageCount> => {

  return customFetch<MessageCount>(getGetMessageCountUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetMessageCountQueryKey = () => {
    return [
    `/api/messages/count`
    ] as const;
    }


export const getGetMessageCountQueryOptions = <TData = Awaited<ReturnType<typeof getMessageCount>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMessageCount>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetMessageCountQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getMessageCount>>> = ({ signal }) => getMessageCount({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getMessageCount>>, TError, TData> & { queryKey: QueryKey }
}

export type GetMessageCountQueryResult = NonNullable<Awaited<ReturnType<typeof getMessageCount>>>
export type GetMessageCountQueryError = ErrorType<unknown>


/**
 * @summary Get total message count
 */

export function useGetMessageCount<TData = Awaited<ReturnType<typeof getMessageCount>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMessageCount>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetMessageCountQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return { ...query, queryKey: queryOptions.queryKey };
}







