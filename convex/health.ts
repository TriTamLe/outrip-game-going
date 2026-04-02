import { query } from './_generated/server'

export const getTitle = query({
  handler: async () => {
    return 'Game Going'
  },
})
