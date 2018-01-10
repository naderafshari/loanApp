import { Form } from './form';

export interface UserInfo {
  uid:           string;
  email:         string;
  role?:         string;
  displayName?:  string;
  photoURL?:     string;
  firstName?:    string;
  lastName?:     string;
  assignedForms?: {};
  addr1Line1?:   string;
  addr1Line2?:   string;
  addr1City?:    string;
  addr1State?:   string;
  addr1Zip?:     string;
}