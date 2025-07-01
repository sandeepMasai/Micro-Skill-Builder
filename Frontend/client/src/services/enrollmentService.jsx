import API from '../Api/axios';

export const enrollInCourse = (courseId) => API.post('/enrollments', { courseId });

export const getMyEnrollments = () => API.get('/enrollments/my-enrollments');
