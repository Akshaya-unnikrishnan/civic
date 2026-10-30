
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUsersAPI, addStaffAPI, updateStaffAPI, deleteStaffAPI } from '../../Services/allAPI'

export const getAllStaff = createAsyncThunk('staff/getAllStaff', async () => {
    const response = await getUsersAPI()
    return response.data.filter(user => user.role === 'staff')
})

export const addStaff = createAsyncThunk('staff/addStaff', async (data) => {
    const response = await addStaffAPI(data)
    return response.data
})

export const updateStaff = createAsyncThunk('staff/updateStaff', async ({ id, staffData }) => {
    const response = await updateStaffAPI(id, staffData)
    return response.data
})

export const deleteStaff = createAsyncThunk('staff/deleteStaff', async (id) => {
    await deleteStaffAPI(id)
    return id
})

const staffSlice = createSlice({
    name: 'staff',
    initialState: { staff: [], loading: false, error: null },
    reducers: {
        clearStaffError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllStaff.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllStaff.fulfilled, (state, action) => {
                state.loading = false
                state.staff = action.payload
            })
            .addCase(getAllStaff.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(addStaff.fulfilled, (state, action) => {
                state.staff.push(action.payload)
            })
            .addCase(updateStaff.fulfilled, (state, action) => {
                const index = state.staff.findIndex(user => String(user.id) === String(action.payload.id))
                if (index !== -1) state.staff[index] = action.payload
            })
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.staff = state.staff.filter(user => String(user.id) !== String(action.payload))
            })
    }
})

export const { clearStaffError } = staffSlice.actions
export default staffSlice.reducer
