import { User as FirebaseUser } from "firebase/auth";

export interface IUser {
  _id: string;
  createdAt: Date;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

export type ILoggedUser = Pick<
  FirebaseUser,
  "uid" | "displayName" | "email" | "photoURL"
>;

export type User = Omit<IUser, "_id">;

export type IUserProps = keyof IUser;

export interface UsersDB {
  createUser: (userData: User) => Promise<IUser>;
  getUserByProperty: (
    property: IUserProps,
    value: string
  ) => Promise<IUser | null>;
}
