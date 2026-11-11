export interface User {
  id: number;
  name: string;
  location: string;
  role: string;
}

export const getUserAction = async (id: number): Promise<User> => {
  await new Promise(res => setTimeout(res, 2000));

  return {
    id,
    name: 'Cristhian Garcia',
    location: 'Bogotá, Colombia',
    role: 'Ingeniero de Software',
  }
}