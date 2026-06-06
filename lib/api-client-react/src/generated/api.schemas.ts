/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */
export interface HealthStatus {
  status: string;
}

export interface Message {
  id: number;
  content: string;
  /** @nullable */
  name?: string | null;
  createdAt: string;
}

export interface MessageInput {
  /**
     * @minLength 1
     * @maxLength 2000
     */
  content: string;
  /** @nullable */
  name?: string | null;
}

export interface MessageCount {
  count: number;
}

export interface ErrorResponse {
  error: string;
}

