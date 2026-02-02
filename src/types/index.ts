export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Sound {
  id: string;
  name: string;
  src: string;
  icon: React.ReactNode;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
