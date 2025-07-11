export type sendEmailType = {
  email: string,
  emailType: "VERIFY"|"RESET",
  userId:string
}

export type tokenType = {
  id: string;
  email: string;
}

export type dbConnectionType = { isConnected?: number };