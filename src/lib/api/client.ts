const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set in .env.local");
  }

  const method = (options.method ?? "GET").toUpperCase();

  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>),
  };

  const hasAuth = Object.keys(headers).some(
    (key) => key.toLowerCase() === "authorization"
  );
   const canCache =
    method === "GET" && !hasAuth && options.cache !== "no-store";
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...(canCache
        ? { next: { revalidate: 60 } }
        : { cache: "no-store" as const }),
      ...options,
      headers,
    });
  } catch {
    throw new ApiError("Network error. Please check your connection.", 0);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
      }
    } catch {

    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}