export type TLogin = {
  email: string;
  password: string;
};

export type TSignUp = {
  name: string;
} & TLogin;
