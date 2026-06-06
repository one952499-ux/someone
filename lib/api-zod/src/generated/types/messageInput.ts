/**
 * Titan X — generated from openapi.yaml.
 * Do not edit by hand; run codegen in @workspace/api-spec.
 */

export interface MessageInput {
  /**
     * @minLength 1
     * @maxLength 2000
     */
  content: string;
  /** @nullable */
  name?: string | null;
}
