import useSWR from 'swr';
import { userService } from '@/lib/services/user.service';

function fetcher() {
  return userService.getAllUsers();
}

export const useUsers = () => {
  const { data, error, isLoading } = useSWR('/api/users', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const users = data?.users?.map(userItem => ({
    id: userItem?.id || '',
    name: userItem?.username || '',
  })) || [];

  return { users, error, isLoading };
}