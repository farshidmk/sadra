import { ILoggedInUser } from "./user";

export type TAuthContext = {
  token: string;
  storeToken: (token: string) => void;
  storeRefreshToken: (refreshToken: string) => void;
  serverCall: (params: TServerCall) => any;
  getRequest: ({ queryKey }: { queryKey: QueryFunction<unknown, QueryKey, any> }) => any;
  isUserLoggedIn: boolean;
  logout: () => void;
  setUserInfo: (ILoggedInUser) => void;
  userInfo: ILoggedInUser;
};

export type TServerCall = {
  entity: string | number | Array<string | number>;
  data?: any;
  method: THttpMethods;
  // method: AXIOS
};

export type THttpMethods = "get" | "post" | "delete" | "put";
