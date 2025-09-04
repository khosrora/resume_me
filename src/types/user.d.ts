// types/user.d.ts
declare global {
  interface User {
    id: string;
    name: string;
    email?: string;
  }

  type Role = "admin" | "user" | "guest";
}

export {};
