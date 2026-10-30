
import { createSlice } from '@reduxjs/toolkit'

let savedUser = null

try {
    savedUser = JSON.parse(localStorage.getItem('loggedUser'))
} catch {
    localStorage.removeItem('loggedUser')
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: savedUser
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            localStorage.setItem('loggedUser', JSON.stringify(action.payload))
        },
        logoutUser: (state) => {
            state.user = null
            localStorage.removeItem('loggedUser')
        }
    }
})

export const { setUser, logoutUser } = authSlice.actions
export default authSlice.reducer
