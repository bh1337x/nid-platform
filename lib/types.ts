export type NidData = {
  name_of_national: string;
  name_of_father: string;
  name_of_mother: string;
  date_of_birth: string;
  image_of_national: string;
};

export enum NidErrorCode {
  NID_EMPTY = -1,
  DOB_EMPTY = -2,
  NID_INVALID = -3,
  DOB_INVALID = -4,
  INPUT_INVALID = -5,
  INTERNAL_SERVER_ERROR = -6,
}

export type NidError = {
  error: string;
  code: NidErrorCode;
};
