import { ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}