import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export default function CurrentTime() {
  const [hydrated, setHydrated] = useState(false)
  const [date, setDate] = useState('')
  useEffect(() => {
    setHydrated(true)
    setDate(dayjs().tz('Asia/Shanghai').format('LTS'))
    const interval = setInterval(() => {
      setDate(dayjs().tz('Asia/Shanghai').format('LTS'))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  if (!hydrated) {
    return null
  }
  return <div className="hidden text-sm font-semibold lg:block">Shanghai: {date}</div>
}
