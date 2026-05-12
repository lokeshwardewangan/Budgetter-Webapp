import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import {
  AppUsersResType,
  NewsletterResType,
} from '@/types/api/admin/reports/userReports';
import { NewsletterCredType } from '@/types/api/admin/reports/credentials';

export const GetAppUsersDetails = async () => {
  const { data } = await apiURL.get<AppUsersResType>(endpoints.admin.users);
  return data;
};

export const SendNewsletter = async (credentials: NewsletterCredType) => {
  const { data } = await apiURL.post<NewsletterResType>(
    endpoints.admin.newsletter,
    credentials
  );
  return data;
};
