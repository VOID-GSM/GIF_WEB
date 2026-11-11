import { apiClient } from "@repo/lib";

import type {
  MypageResponse,
  PatchMyInfoResponse,
  UpdateClientInfoRequest,
  UpdateMypageRequest,
  UserLink,
  UserLinkRequest,
} from "@/entities/mypage/model/type";

export const updateClientInfo = (body: UpdateClientInfoRequest) =>
  apiClient.patch<PatchMyInfoResponse>("/api/users/me", body);

export const getMypage = async () => {
  const { data } = await apiClient.get<MypageResponse>("/api/users/me/mypage");
  return data;
};

export const updateMypage = async (body: UpdateMypageRequest) => {
  const { data } = await apiClient.patch<MypageResponse>(
    "/api/users/me/mypage",
    body,
  );
  return data;
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.put<MypageResponse>(
    "/api/users/me/profile-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

export const deleteProfileImage = async () => {
  const { data } = await apiClient.delete<MypageResponse>(
    "/api/users/me/profile-image",
  );
  return data;
};

export const addMyLink = async (body: UserLinkRequest) => {
  const { data } = await apiClient.post<UserLink>("/api/users/me/links", body);
  return data;
};

export const updateMyLink = async ({
  linkId,
  ...body
}: UserLinkRequest & { linkId: number }) => {
  const { data } = await apiClient.patch<UserLink>(
    `/api/users/me/links/${linkId}`,
    body,
  );
  return data;
};

export const deleteMyLink = async (linkId: number) => {
  await apiClient.delete(`/api/users/me/links/${linkId}`);
};
