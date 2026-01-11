import { makeRequest } from "../lib/axios";

export type Role = "admin" | "user" | "manager";

interface RegisterUserProps {
  password: string;
  name: string;
  role: Role; // <-- expects Role, not just string
}

export default async function registerUser(inputs: RegisterUserProps) {
  const res = await makeRequest.post("/auth/register", inputs);
  return res.data; 
  
}
