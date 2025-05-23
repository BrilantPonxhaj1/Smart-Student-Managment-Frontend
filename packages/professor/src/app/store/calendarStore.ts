import { defineStore } from 'pinia'
import { useDate } from 'vuetify'
import { ref } from 'vue'


type DateAdapter = ReturnType<typeof useDate>

export const useCalendarStore = defineStore('calendar', () => {
    const type = ref<'month'|'week'|'day'>('month')
    const types = ['month','week','day'] as const

    const weekday = ref<number[]>([0,1,2,3,4,5,6])
    const weekdays = [
        { title: 'Sun–Sat',   value: [0,1,2,3,4,5,6] },
        { title: 'Mon–Sun',   value: [1,2,3,4,5,6,0] },
        { title: 'Mon–Fri',   value: [1,2,3,4,5] },
        { title: 'Mon,Wed,Fri', value: [1,3,5] },
    ]

    const value = ref<(Date|number|string)[]>([ new Date() ])
    const events = ref<any[]>([])

    function rnd(a: number, b: number) {
        return Math.floor((b - a + 1) * Math.random()) + a
    }

    function getEvents() {
        const adapter = useDate() as DateAdapter

        const start: Date = adapter.startOfDay(adapter.startOfMonth(new Date()))
        const end:   Date = adapter.endOfDay  (adapter.endOfMonth(  new Date()))
        const days = (end.getTime() - start.getTime()) / 86400000

        const count = rnd(days, days + 20)
        const evs: any[] = []
        for (let i = 0; i < count; i++) {
            const allDay = rnd(0,3) === 0
            const t0 = rnd(start.getTime(), end.getTime())
            const first = new Date(t0 - (t0 % 900000))
            const span = rnd(2, allDay ? 288 : 8) * 900000
            const second = new Date(first.getTime() + span)
            evs.push({
                title: 'Meeting',
                start: first,
                end: second,
                allDay,
            })
        }
        events.value = evs
    }

    // initialize
    getEvents()

    return {
        type, types,
        weekday, weekdays,
        value, events,
        getEvents,
    }
})