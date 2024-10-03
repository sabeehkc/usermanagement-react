import { apiSlice } from "./apiSlice";

const ADMIN_URL = '/api/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        fetchUsers: builder.query({ 
            query: () => ({
                url: `${ADMIN_URL}/dashboard`, 
                method: 'GET'
            }),
            providesTags: ['Users'],
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: `${ADMIN_URL}/logout`,
                method: 'POST'
            }),
        }),

        editUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `${ADMIN_URL}/users/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),

        
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${ADMIN_URL}/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});


export const {
    useAdminLoginMutation, 
    useAdminLogoutMutation,
    useFetchUsersQuery, 
    useEditUserMutation,
    useDeleteUserMutation,
} = adminApiSlice;
