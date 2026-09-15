import { reactive } from 'vue';
import { ref as dbRef, set, remove, onValue } from 'firebase/database';
import { db } from '../firebase';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  yearLevel: string;
  section: string;
  contactNumber: string;
}

const studentsRef = dbRef(db, 'students');
const connectedRef = dbRef(db, '.info/connected');

const state = reactive<{
  students: Student[];
  isConnected: boolean;
}>({
  students: [],
  isConnected: false
});

let unsubscribeStudents: (() => void) | null = null;
let unsubscribeConnected: (() => void) | null = null;

export const useStudentStore = () => {
  const init = () => {
    unsubscribeStudents = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mapped: Student[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Student, 'id'>)
        }));
        state.students.splice(0, state.students.length, ...mapped);
      } else {
        state.students.splice(0, state.students.length);
      }
    });

    unsubscribeConnected = onValue(connectedRef, (snapshot) => {
      state.isConnected = snapshot.val() === true;
    });
  };

  const destroy = () => {
    if (unsubscribeStudents) {
      unsubscribeStudents();
      unsubscribeStudents = null;
    }
    if (unsubscribeConnected) {
      unsubscribeConnected();
      unsubscribeConnected = null;
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const id = crypto.randomUUID();
    await set(dbRef(db, `students/${id}`), student);
    return id;
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    const updateData: Record<string, string> = {
      studentId: data.studentId ?? '',
      name: data.name ?? '',
      course: data.course ?? '',
      yearLevel: data.yearLevel ?? '',
      section: data.section ?? '',
      contactNumber: data.contactNumber ?? ''
    };
    await set(dbRef(db, `students/${id}`), updateData);
  };

  const deleteStudent = async (id: string) => {
    await remove(dbRef(db, `students/${id}`));
  };

  const getStudent = (id: string): Student | undefined => {
    return state.students.find(s => s.id === id);
  };

  const searchStudents = (query: string): Student[] => {
    const lower = query.toLowerCase();
    return state.students.filter(s =>
      s.studentId.toLowerCase().includes(lower) ||
      s.name.toLowerCase().includes(lower) ||
      s.course.toLowerCase().includes(lower) ||
      s.yearLevel.toLowerCase().includes(lower) ||
      s.section.toLowerCase().includes(lower) ||
      s.contactNumber.includes(lower)
    );
  };

  return {
    state,
    init,
    destroy,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    searchStudents
  };
};
