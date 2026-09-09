export function logout(router) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }
  router.push('/login')
}

export function getStoredRole() {
  return typeof window !== 'undefined' ? localStorage.getItem('role') : null
}