import { Form } from './form';

export interface UserInfo {
  uid:           string;
  email:         string;
  role?:         string;
  displayName?:  string;
  photoURL?:     string;
  firstName?:    string;
  lastName?:     string;
}
