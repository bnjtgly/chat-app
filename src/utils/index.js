export const isAuthenticated = () => {
  return !!localStorage.data.token
}