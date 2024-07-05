export interface ITokenData {
  sub: number;
  email: string;
  role: "Employee" | "Admin";
  iat: number;
  exp: number;
}
