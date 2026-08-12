/**
 * Some failure modes (a killed dev server mid-request, an upstream proxy
 * timeout, a 204/empty response) leave the body empty or non-JSON. Calling
 * `response.json()` directly on those throws a useless
 * "Unexpected end of JSON input" that hides the real HTTP status. Parse
 * defensively so callers always get a readable error instead.
 */
export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      throw new Error(
        `서버 응답을 해석할 수 없습니다. (status ${response.status})`,
      );
    }
  }

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : `요청이 실패했습니다. (status ${response.status})`;
    throw new Error(message);
  }

  return body as T;
}
