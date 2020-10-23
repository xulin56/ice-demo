import { request } from 'ice';
export const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

interface UserInfo {
  name: string;
  department: string;
  avatar: string;
  userid: number | null;
}
export default {
  state: {
    name: 'default',
    department: '',
    avatar: '',
    userid: null,
  },

  effects: (dispatch) => ({
    async fetchUserProfile() {
      const res = await request('/api/profile');
      if (res.status === 'SUCCESS') {
        dispatch.user.update(res.data);
      }
    },
    async getUserInfo() {
      await delay(5000);
      this.update({
        name: 'taobao',
        department: '总统套房',
        avatar: '老实交代',
        userid: 232389,
      });
    }
  }),

  reducers: {
    update(prevState: UserInfo, payload: UserInfo) {
      return { ...prevState, ...payload };
    },
  },
};