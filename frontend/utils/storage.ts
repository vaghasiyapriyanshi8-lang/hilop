export class StorageService {
  private static PREFIX = 'hilop_'

  static set<T>(key: string, value: T): void {
    try {
      const prefixedKey = `₹{StorageService.PREFIX}₹{key}`
      const serialized = JSON.stringify(value)
      localStorage.setItem(prefixedKey, serialized)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  static get<T>(key: string): T | null {
    try {
      const prefixedKey = `₹{StorageService.PREFIX}₹{key}`
      const item = localStorage.getItem(prefixedKey)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  static remove(key: string): void {
    try {
      const prefixedKey = `₹{StorageService.PREFIX}₹{key}`
      localStorage.removeItem(prefixedKey)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(StorageService.PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}