import { mapActions, mapState, Module } from 'vuex';
import jwtDecode from 'jwt-decode';
import { JwtClaims } from '../../api/common';
import { RootState } from '..';
import {
  accountService,
  ApiTokens,
  LoginRequest,
  RegisterRequest
} from '../../api/accountService';
import { userService } from '../../api/userService';

const INITIAL_STATE: AccountModuleState = {
  token: '',
  refreshToken: ''
};

type AccountModule = Module<AccountModuleState, RootState>;

export const MUTATIONS = {
  RESET_STATE: 'RESET_STATE',
  UPDATE_TOKENS: 'UPDATE_TOKENS',
  SET_LOADING: 'SET_LOADING'
};

export type AccountModuleState = {
  token: string;
  refreshToken: string;
};

export const accountModule: AccountModule = {
  namespaced: true,
  state() {
    return { ...INITIAL_STATE };
  },
  mutations: {
    [MUTATIONS.UPDATE_TOKENS](state, { token, refreshToken }: ApiTokens) {
      state.token = token;
      state.refreshToken = refreshToken;

      const claims = jwtDecode<JwtClaims>(token);

      localStorage.setItem('tokenExpiryTime', claims.exp.toString());
    },
    [MUTATIONS.RESET_STATE](state) {
      Object.assign(state, INITIAL_STATE);
    }
  },
  actions: {
    async login({ dispatch, commit }, request: LoginRequest) {
      const [
        { data: tokens, isValid: isValidTokens },
        { data: user, isValid: isValidUser }
      ] = await Promise.all([
        accountService().login(request).promise,
        userService().getByName(request.username).promise
      ]);

      const isValid = isValidTokens.value && isValidUser.value;

      if (isValid) {
        commit(MUTATIONS.UPDATE_TOKENS, tokens.value);
        dispatch('userModule/setUser', user.value, { root: true });
      }

      return isValid;
    },
    async register({ dispatch, commit }, request: RegisterRequest) {
      const {
        data: tokens,
        isValid: isValidTokens
      } = await accountService().register(request).promise;

      const {
        data: user,
        isValid: isValidUser
      } = await userService().getByName(request.username).promise;

      const isValid = isValidTokens.value && isValidUser.value;

      if (isValid) {
        commit(MUTATIONS.UPDATE_TOKENS, tokens.value);
        dispatch('userModule/setUser', user.value, { root: true });
      }

      return isValid;
    },
    async logout({ commit, dispatch }) {
      dispatch('userModule/resetState', null, { root: true });

      await accountService().logout(this).promise;

      commit(MUTATIONS.RESET_STATE);
    },
    async deleteAccount({ commit, dispatch }) {
      dispatch('userModule/resetState', null, { root: true });

      await accountService().deleteAccount(this).promise;

      commit(MUTATIONS.RESET_STATE);
    }
  }
};

export const accountModuleActions = mapActions('accountModule', {
  login: (dispatch, payload: LoginRequest) => dispatch('login', payload),
  regiser: (dispatch, payload: RegisterRequest) =>
    dispatch('register', payload),
  logout: dispatch => dispatch('logout'),
  deleteAccount: dispatch => dispatch('deleteAccount')
});

export const accountModuleState = mapState<
  AccountModuleState,
  {
    [K in keyof AccountModuleState]: (
      state: AccountModuleState,
      // Remember to update this type according to the getters in gridModule
      getters: any
    ) => AccountModuleState[K];
  }
>('accountModule', {
  token: state => state.token,
  refreshToken: state => state.refreshToken
});
