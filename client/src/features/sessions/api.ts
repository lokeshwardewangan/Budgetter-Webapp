import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { SessionEntry } from '@/types/api/auth/auth';

export async function getSessions(): Promise<ApiResponse<SessionEntry[]>> {
  const { data } = await apiURL.get<ApiResponse<SessionEntry[]>>(
    endpoints.sessions.list
  );
  return data;
}

export async function deleteSession(
  sessionId: string
): Promise<ApiResponse<null>> {
  const { data } = await apiURL.delete<ApiResponse<null>>(
    endpoints.sessions.one(sessionId)
  );
  return data;
}

// Server-side this only removes sessions OTHER than the current one — the
// current session keeps working after the call. To fully sign out everywhere
// the user must call this and then also log out their current session.
export async function deleteOtherSessions(): Promise<ApiResponse<null>> {
  const { data } = await apiURL.delete<ApiResponse<null>>(
    endpoints.sessions.list
  );
  return data;
}
