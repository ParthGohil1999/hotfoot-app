import { AuthManager } from './auth';
import type { CalendarEvent } from '../types/auth';

export class CalendarTools {
  private authManager = AuthManager.getInstance();

  // Google Calendar API calls
  async getGoogleCalendarEvents(timeMin?: string, timeMax?: string): Promise<string> {
    try {
      const tokens = await this.authManager.getGoogleTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Google. Please authenticate first.';
      }

      const now = new Date();
      const defaultTimeMin = timeMin || now.toISOString();
      const defaultTimeMax = timeMax || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${defaultTimeMin}&timeMax=${defaultTimeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshGoogleToken();
        if (newToken) {
          return this.getGoogleCalendarEvents(timeMin, timeMax);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const events = data.items.map((event: any, index: number) => {
            const startTime = event.start?.dateTime || event.start?.date;
            const endTime = event.end?.dateTime || event.end?.date;
            return `${index + 1}. ${event.summary || 'No Title'} - ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}`;
          }).join('\n');
          
          return `Upcoming Google Calendar events:\n${events}`;
        } else {
          return 'No upcoming events found in Google Calendar.';
        }
      } else {
        const error = await response.text();
        return `Error fetching Google Calendar events: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async createGoogleCalendarEvent(title: string, startDateTime: string, endDateTime: string, description?: string): Promise<string> {
    try {
      const tokens = await this.authManager.getGoogleTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Google. Please authenticate first.';
      }

      const event = {
        summary: title,
        description: description || '',
        start: {
          dateTime: startDateTime,
          timeZone: 'America/New_York', // You can make this configurable
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'America/New_York',
        },
      };

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshGoogleToken();
        if (newToken) {
          return this.createGoogleCalendarEvent(title, startDateTime, endDateTime, description);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Event "${title}" created successfully in Google Calendar`;
      } else {
        const error = await response.text();
        return `Error creating Google Calendar event: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async updateGoogleCalendarEvent(eventId: string, title: string, startDateTime: string, endDateTime: string, description?: string): Promise<string> {
    try {
      const tokens = await this.authManager.getGoogleTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Google. Please authenticate first.';
      }

      const event = {
        summary: title,
        description: description || '',
        start: {
          dateTime: startDateTime,
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'America/New_York',
        },
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshGoogleToken();
        if (newToken) {
          return this.updateGoogleCalendarEvent(eventId, title, startDateTime, endDateTime, description);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Event "${title}" updated successfully in Google Calendar`;
      } else {
        const error = await response.text();
        return `Error updating Google Calendar event: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  // Microsoft Calendar API calls
  async getOutlookCalendarEvents(timeMin?: string, timeMax?: string): Promise<string> {
    try {
      const tokens = await this.authManager.getMicrosoftTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Microsoft. Please authenticate first.';
      }

      const now = new Date();
      const defaultTimeMin = timeMin || now.toISOString();
      const defaultTimeMax = timeMax || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/events?$filter=start/dateTime ge '${defaultTimeMin}' and end/dateTime le '${defaultTimeMax}'&$orderby=start/dateTime&$select=subject,start,end,body`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshMicrosoftToken();
        if (newToken) {
          return this.getOutlookCalendarEvents(timeMin, timeMax);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const events = data.value.map((event: any, index: number) => {
            const startTime = event.start?.dateTime;
            const endTime = event.end?.dateTime;
            return `${index + 1}. ${event.subject || 'No Title'} - ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}`;
          }).join('\n');
          
          return `Upcoming Outlook Calendar events:\n${events}`;
        } else {
          return 'No upcoming events found in Outlook Calendar.';
        }
      } else {
        const error = await response.text();
        return `Error fetching Outlook Calendar events: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async createOutlookCalendarEvent(title: string, startDateTime: string, endDateTime: string, description?: string): Promise<string> {
    try {
      const tokens = await this.authManager.getMicrosoftTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Microsoft. Please authenticate first.';
      }

      const event = {
        subject: title,
        body: {
          contentType: 'HTML',
          content: description || ''
        },
        start: {
          dateTime: startDateTime,
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'America/New_York'
        }
      };

      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshMicrosoftToken();
        if (newToken) {
          return this.createOutlookCalendarEvent(title, startDateTime, endDateTime, description);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Event "${title}" created successfully in Outlook Calendar`;
      } else {
        const error = await response.text();
        return `Error creating Outlook Calendar event: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async updateOutlookCalendarEvent(eventId: string, title: string, startDateTime: string, endDateTime: string, description?: string): Promise<string> {
    try {
      const tokens = await this.authManager.getMicrosoftTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Microsoft. Please authenticate first.';
      }

      const event = {
        subject: title,
        body: {
          contentType: 'HTML',
          content: description || ''
        },
        start: {
          dateTime: startDateTime,
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'America/New_York'
        }
      };

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshMicrosoftToken();
        if (newToken) {
          return this.updateOutlookCalendarEvent(eventId, title, startDateTime, endDateTime, description);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Event "${title}" updated successfully in Outlook Calendar`;
      } else {
        const error = await response.text();
        return `Error updating Outlook Calendar event: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  // Utility functions for date handling
  getTodayEvents(): Promise<string> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const timeMin = today.toISOString();
    const timeMax = tomorrow.toISOString();
    
    return this.getGoogleCalendarEvents(timeMin, timeMax);
  }

  getThisWeekEvents(): Promise<string> {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const timeMin = today.toISOString();
    const timeMax = nextWeek.toISOString();
    
    return this.getGoogleCalendarEvents(timeMin, timeMax);
  }

  getNextSixMonthsEvents(): Promise<string> {
    const today = new Date();
    const sixMonthsLater = new Date(today);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    
    const timeMin = today.toISOString();
    const timeMax = sixMonthsLater.toISOString();
    
    return this.getGoogleCalendarEvents(timeMin, timeMax);
  }
}