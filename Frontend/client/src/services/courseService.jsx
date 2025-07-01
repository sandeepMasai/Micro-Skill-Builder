import API from '../Api/axios';

export const getCourses = () => API.get('/courses');

export const getCourseById = (courseId) => API.get(`/courses/${courseId}`);

export const createCourse = (data) => API.post('/courses', data);
