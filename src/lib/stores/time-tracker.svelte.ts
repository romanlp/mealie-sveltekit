import { makeClient } from '$lib/utils';

interface PageWithUser {
  data: {
    user?: {
      id: string;
    };
  };
}

class TimeTrackerStore {
  isRunning = $state(false);
  startTime = $state<Date | null>(null);
  elapsedTime = $state(0);
  timer = $state<NodeJS.Timeout | null>(null);
  currentTimeEntry = $state<string | null>(null);

  constructor() {
    // Load from localStorage on initialization if available
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('timeTrackerState');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.isRunning = state.isRunning;
        this.startTime = state.startTime ? new Date(state.startTime) : null;
        this.elapsedTime = state.elapsedTime;
        this.currentTimeEntry = state.currentTimeEntry;

        // If timer was running, restart it
        if (this.isRunning && this.startTime) {
          this.startTimeTracking();
        }
      }
    }
  }

  startTimeTracking() {
    this.timer = setInterval(() => {
      if (this.startTime) {
        this.elapsedTime = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
      }
    }, 1000);
  }

  async startTimer(page: PageWithUser) {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = new Date();
      this.startTimeTracking();

      try {
        // Check if user data is available
        if (page?.data?.user?.id) {
          // Create a new time entry
          const response = await makeClient(fetch).api['time-entry'].$post({
            json: {
              userId: page.data.user.id,
              startTime: this.startTime,
              billable: true,
              invoiced: false
            }
          });

          if (response.ok) {
            const data = await response.json();
            this.currentTimeEntry = data.id;
          }
        } else {
          console.warn('User data not available for time tracking');
        }
      } catch (error) {
        console.error('Failed to start time tracking:', error);
      }
    }
  }

  async stopTimer() {
    if (this.isRunning && this.currentTimeEntry) {
      this.isRunning = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      try {
        // Update the time entry with end time
        await fetch(`/api/time-entry/${this.currentTimeEntry}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endTime: new Date(),
            durationMinutes: Math.floor(this.elapsedTime / 60)
          })
        });
      } catch (error) {
        console.error('Failed to stop time tracking:', error);
      }

      this.currentTimeEntry = null;
    }
  }
}

export const timeTracker = new TimeTrackerStore();
