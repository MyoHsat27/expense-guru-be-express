export interface UserObject {
  _id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  _v: number;
}

export interface UserCreateObject {
  username: string;
  email: string;
  password: string;
  Oauth?:boolean
}

export interface UserResponseObject {
  id:string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}
