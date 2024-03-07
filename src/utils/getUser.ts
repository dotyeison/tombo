import { IUser } from '@states/app/app.state.types';

export async function getUser(): Promise<IUser> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { name: 'test user', email: 'testuserr@test.com' };
  } catch (err) {
    return Promise.reject(err);
  }
}
