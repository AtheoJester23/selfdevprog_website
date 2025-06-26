import { goalDeets } from '@/app/(root)/goal/page';
import { atom } from 'jotai'

// For Opening Delete Modal:
export const modalDelete = atom(false);

export const allGoals = atom<goalDeets[]>([]);