import { defineStore } from 'pinia'
import axios from 'axios'

export const localHost = 'http://localhost:3333'; // Change port if needed

export const usePriestStore = defineStore('priest', {
    state: () => ({
        priests: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchPriests() {
            this.loading = true
            this.error = null
            try {
                const response = await axios.get(`${localHost}/allPriest`)
                this.priests = response.data
                console.log("this are the priests", this.priests)
            } catch (err) {
                this.error = err
            } finally {
                this.loading = false
            }
        },
    },
})