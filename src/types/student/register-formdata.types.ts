
interface StudentRegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    studentName: string;
    birthPlace: string;
    birthDate: string;
    studentGender: 'L' | 'P'
    religion: 'Islam' | 'Kristen' | 'Hindu' | 'Budha' | 'Konghucu'
    studentPhone: string;
    studentAddress: string;
    schoolName: string;
    grade: string;
    parentName: string;
    parentRelation: 'father' | 'mother' | 'other'
    parentEmail: string;
    parentPhone: string;
    parentAddress: string;
}