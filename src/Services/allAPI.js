
import apiServices from '../api/apiServices'

// Issue APIs
export const getAllIssuesAPI = () => apiServices('GET', '/issues', '')
export const addIssueAPI = (data) => apiServices('POST', '/issues', data)
export const updateIssueAPI = (id, data) => apiServices('PUT', `/issues/${id}`, data)
export const deleteIssueAPI = (id) => apiServices('DELETE', `/issues/${id}`, '')

// User APIs
export const getUsersAPI = () => apiServices('GET', '/users', '')
export const registerUserAPI = (data) => apiServices('POST', '/users', data)

// Staff management APIs
export const addStaffAPI = (data) => apiServices('POST', '/users', data)
export const updateStaffAPI = (id, data) => apiServices('PUT', `/users/${id}`, data)
export const deleteStaffAPI = (id) => apiServices('DELETE', `/users/${id}`, '')


/* Notification APIs */
export const getNotificationsAPI = (userId) =>
    apiServices('GET', `/notifications?recipientId=${userId}`, '')

export const addNotificationAPI = (data) =>
    apiServices('POST', '/notifications', data)

export const updateNotificationAPI = (id, data) =>
    apiServices('PATCH', `/notifications/${id}`, data)

export const deleteNotificationAPI = (id) =>
    apiServices('DELETE', `/notifications/${id}`, '')


// feedback

export const getFeedbackAPI = (issueId) =>
    apiServices('GET', `/feedback?issueId=${issueId}`, '')

export const getAllFeedbackAPI = () =>
    apiServices('GET', '/feedback', '')

export const addFeedbackAPI = (data) =>
    apiServices('POST', '/feedback', data)
