interface User {
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  phoneNumber: string;
  rt: string | null;
  stripeId: string | null;
  roleId: number;
  login(): User[];
  register(id: number): User;
  logout(data: User): void;
  checkProfile(id: number, data: User): User;
}

interface Role {}
