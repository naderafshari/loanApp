import { ShoppingCart } from './cart';

export interface UserInfo {
  uid:           string;
  email:         string;
  role?:         string;
  function?:     string;
  displayName?:  string;
  photoURL?:     string;
  joinedTime?:   string;
  firstName?:    string;
  lastName?:     string;
  dob?:          string;
  assignedForms?: {};
  purchased?:     {};
  cart?:         ShoppingCart;
  addr1Line1?:   string;
  addr1Line2?:   string;
  addr1City?:    string;
  addr1State?:   string;
  addr1Zip?:     string;
}
