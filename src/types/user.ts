export type TGender = "male" | "female";
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  startCreationTime: string;
  endCreationTime: string;
  personnelCode: string;
  nationalId: string;
  gender: TGender | undefined;
  branch: number | undefined;
  status: number | undefined;
  roles: number[] | undefined;
  activationDate: string;
  expireDate: string;
}

export interface IPaginationUser extends IUser {
  pageNo?: number;
  totalElements?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface ISelectedUser {
  mode: "edit" | "view" | "create";
  user?: IUser;
}

export interface ILoggedInUser {
  full_name: string;
  user_id: number;
}
