export type ResponseData<T> = {
  message: string;
  success: boolean;
  data: T;
};

export type ResponseDataArr<T> = {
  message: string;
  success: boolean;
  data: T[];
};
