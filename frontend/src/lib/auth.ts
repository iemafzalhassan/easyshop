export async function checkAuth() {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}
