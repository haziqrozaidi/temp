import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUser } from '@clerk/vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userId = ref(null)
  const username = ref(null)
  const email = ref(null)
  const role = ref(null)
  const isUserLoaded = ref(false)

  // Get user from Clerk and extract data
  const initializeUser = async () => {
    const { user, isLoaded, isSignedIn } = useUser()
    
    if (isLoaded.value && isSignedIn.value) {
      userId.value = user.value.id
      username.value = user.value.username || user.value.firstName || user.value.primaryEmailAddress?.emailAddress.split('@')[0]
      email.value = user.value.primaryEmailAddress?.emailAddress
      
      // Extract role from publicMetadata if it exists
      if (user.value.publicMetadata) {
        role.value = user.value.publicMetadata.role
      }
      
      isUserLoaded.value = true
      
      // Send user data to backend
      await sendUserDataToBackend()
    }
  }
  
  // Send user data to backend using Fetch API
  const sendUserDataToBackend = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clerkUserId: userId.value,
          username: username.value,
          email: email.value,
          role: role.value
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to sync user data with backend:', error)
    }
  }

  return {
    // State
    userId,
    username,
    email,
    role,
    isUserLoaded,
    // Actions
    initializeUser,
    sendUserDataToBackend
  }
})
