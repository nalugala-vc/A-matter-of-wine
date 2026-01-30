import { useState } from 'react'
import { Event, ViewMode } from '../types'
import EventsHeader from '../components/EventsHeader'
import EventsList from '../components/EventsList'
import eventImage1 from '../../../assets/images/pexels-mlkbnl-9299260.jpg'
import eventImage2 from '../../../assets/images/pexels-marketingtuig-87224.jpg'
import eventImage3 from '../../../assets/images/ChatGPT Image Jan 25, 2026, 06_56_39 PM.png'
import './Events.css'

// Mock data for UI development - matching exact design
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Street Food Festival',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    location: 'Eventicity Club 8 E 9th Street, Chicago, IL, United States',
    date: '2024-10-01',
    startTime: '06:00',
    endTime: '15:00',
    price: 70,
    imageUrl: eventImage1,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Corporate celebrations',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    location: 'Eventicity Club 8 E 9th Street, Chicago, IL, United States',
    date: '2024-10-04',
    startTime: '06:00',
    endTime: '15:00',
    price: 85,
    imageUrl: eventImage2,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Apple event: introducing new IOS',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    location: 'Eventicity Club 8 E 9th Street, Chicago, IL, United States',
    date: '2024-10-06',
    startTime: '06:00',
    endTime: '15:00',
    price: 'Free',
    imageUrl: eventImage3,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function Events() {
  const [events] = useState<Event[]>(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFindEvents = () => {
    // Handle find events action
    console.log('Finding events with query:', searchQuery)
  }

  const handleSubscribe = () => {
    // Handle subscribe to calendar action
    console.log('Subscribe to calendar')
  }

  const handleEventClick = (event: Event) => {
    // Handle event click - can open detail modal or navigate
    console.log('Event clicked:', event)
  }

  return (
    <div className="events-page">
      <div className="events-container">
        <EventsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFindEvents={handleFindEvents}
          onSubscribe={handleSubscribe}
        />

        <EventsList
          events={filteredEvents}
          onEventClick={handleEventClick}
          emptyMessage="No events found. Try adjusting your search."
        />
      </div>
    </div>
  )
}

export default Events
