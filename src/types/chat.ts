export interface Message {
  id: string;
  role: 'user' | 'moodi';
  text: string;
}
