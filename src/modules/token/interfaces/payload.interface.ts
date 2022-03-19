export interface IAccessPayload {
  id: number;
  password: string;
}

export interface IRefreshPayload {
  id: number;
  agent: string;
  date: number;
}
