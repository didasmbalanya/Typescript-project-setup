export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  slackId: string;
  id?: number;
}

export interface ISerializedUser {
  name: string;
  email: string;
  slackId: string;
}
