export interface UserInfo {
  uid:           string;
  email:         string;
  role?:         string;
  function?:     string;
  displayName?:  string;
  photoURL?:     string;
  joinTime?:   string;
  updateTime?:  string;
  firstName?:    string;
  lastName?:     string;
  dob?:          string;
  assignedForms?: {};
  purchased?:    any[];   // used if lender
  addr1Line1?:   string;
  addr1Line2?:   string;
  addr1City?:    string;
  addr1State?:   string;
  addr1Zip?:     string;
}
