export interface UserInfo {
    email: string,
    displayName?: string,
    firstName?: string,
    lastName?: string
  }

  export  interface UserAuthInfo {
    uid: string;
    email: string;
    role: string;
    photoURL?: string;
    displayName?: string;
  }