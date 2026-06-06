/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
import * as zod from 'zod';


/**
 * Returns server health status
 * @summary Health check
 */
export const HealthCheckResponse = zod.object({
  "status": zod.string()
})


/**
 * @summary Submit a visitor message
 */
export const createMessageBodyContentMax = 2000;



export const CreateMessageBody = zod.object({
  "content": zod.string().min(1).max(createMessageBodyContentMax),
  "name": zod.string().nullish()
})

export const CreateMessageResponse = zod.void()


/**
 * @summary Get total message count
 */
export const GetMessageCountResponse = zod.object({
  "count": zod.number()
})


