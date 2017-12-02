export interface UserInfo {
    displayName: string,
    email: string,
    firstName: string,
    lastName: string
  }

export interface Roles {
    reader: boolean;
    author?: boolean;
    admin?:  boolean;
  }

  export  interface UserAuthInfo {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    role?: Roles;
  }
  
  export class UserAuth {
    email:    string;
    photoURL: string;
    displayName: string;
    roles:    Roles;
    constructor(authData) {
      this.email    = authData.email
      this.photoURL = authData.photoURL
      this.displayName = authData.displayName1
      this.roles    = { reader: true }
    }
  }