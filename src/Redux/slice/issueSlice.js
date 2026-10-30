
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllIssuesAPI, addIssueAPI, updateIssueAPI, deleteIssueAPI } from '../../Services/allAPI'

export const getAllIssues = createAsyncThunk(
    'issues/getAllIssues',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllIssuesAPI()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch issues')
        }
    }
)

export const addIssue = createAsyncThunk(
    'issues/addIssue',
    async (issueData, { rejectWithValue }) => {
        try {
            const response = await addIssueAPI(issueData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add issue')
        }
    }
)

export const updateIssue = createAsyncThunk(
    'issues/updateIssue',
    async ({ id, issueData }, { rejectWithValue }) => {
        try {
            const response = await updateIssueAPI(id, issueData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update issue')
        }
    }
)

export const deleteIssue = createAsyncThunk(
    'issues/deleteIssue',
    async (id, { rejectWithValue }) => {
        try {
            await deleteIssueAPI(id)
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete issue')
        }
    }
)

const issueSlice = createSlice({
    name: 'issues',
    initialState: {
        issues: [],
        loading: false,
        error: null
    },
    reducers: {
        clearIssueError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch issues
            .addCase(getAllIssues.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllIssues.fulfilled, (state, action) => {
                state.loading = false
                state.issues = action.payload
            })
            .addCase(getAllIssues.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })

            // Add issue
            .addCase(addIssue.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addIssue.fulfilled, (state, action) => {
                state.loading = false
                state.issues.push(action.payload)
            })
            .addCase(addIssue.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })

            // Update issue
            .addCase(updateIssue.pending, (state) => {
                state.error = null
            })
            .addCase(updateIssue.fulfilled, (state, action) => {
                const index = state.issues.findIndex(issue => String(issue.id) === String(action.payload.id))
                if (index !== -1) {
                    state.issues[index] = action.payload
                }
            })
            .addCase(updateIssue.rejected, (state, action) => {
                state.error = action.payload || action.error.message
            })

            // Delete issue
            .addCase(deleteIssue.pending, (state) => {
                state.error = null
            })
            .addCase(deleteIssue.fulfilled, (state, action) => {
                state.issues = state.issues.filter(issue => String(issue.id) !== String(action.payload))
            })
            .addCase(deleteIssue.rejected, (state, action) => {
                state.error = action.payload || action.error.message
            })
    }
})

export const { clearIssueError } = issueSlice.actions
export default issueSlice.reducer
