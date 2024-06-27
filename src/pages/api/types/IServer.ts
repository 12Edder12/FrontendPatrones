export interface IServer {
    id: number;
    name: string;
    string_url: string;
    user: string;
    password: string;
    database: string;
    type_bd: string;
    port: number;
    ssl: boolean;
    statusActive: boolean;
    description: string | null;
  }