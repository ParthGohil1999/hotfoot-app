import * as Battery from "expo-battery";
import * as Brightness from "expo-brightness";
import { EmailTools } from './emailTools';
import { CalendarTools } from './calendarTools';
import { AuthManager } from './auth';

const emailTools = new EmailTools();
const calendarTools = new CalendarTools();
const authManager = AuthManager.getInstance();

const get_battery_level = async () => {
  const batteryLevel = await Battery.getBatteryLevelAsync();
  console.log("batteryLevel", batteryLevel);
  if (batteryLevel === -1) {
    return "Error: Device does not support retrieving the battery level.";
  }
  return batteryLevel.toString();
};

const change_brightness = ({ brightness }: { brightness: number }) => {
  console.log("change_brightness", brightness);
  Brightness.setSystemBrightnessAsync(brightness);
  return brightness.toString();
};

const flash_screen = () => {
  Brightness.setSystemBrightnessAsync(1);
  setTimeout(() => {
    Brightness.setSystemBrightnessAsync(0);
  }, 200);
  return "Successfully flashed the screen.";
};

// Email tools
const send_gmail = async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
  console.log("send_gmail", to, subject, body);
  return await emailTools.sendGmailEmail(to, subject, body);

};

const create_gmail_draft = async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
  return await emailTools.createGmailDraft(to, subject, body);
};

const get_gmail_messages = async ({ maxResults = 10 }: { maxResults?: number } = {}) => {
  return await emailTools.getGmailMessages(maxResults);
};

const send_outlook_email = async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
  return await emailTools.sendOutlookEmail(to, subject, body);
};

const create_outlook_draft = async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
  return await emailTools.createOutlookDraft(to, subject, body);
};

const get_outlook_messages = async ({ maxResults = 10 }: { maxResults?: number } = {}) => {
  return await emailTools.getOutlookMessages(maxResults);
};

// Calendar tools
const get_google_calendar_events = async ({ timeRange = 'week' }: { timeRange?: 'today' | 'week' | 'month' | 'six_months' } = {}) => {
  switch (timeRange) {
    case 'today':
      return await calendarTools.getTodayEvents();
    case 'week':
      return await calendarTools.getThisWeekEvents();
    case 'six_months':
      return await calendarTools.getNextSixMonthsEvents();
    default:
      return await calendarTools.getThisWeekEvents();
  }
};

const create_google_calendar_event = async ({ 
  title, 
  startDateTime, 
  endDateTime, 
  description 
}: { 
  title: string; 
  startDateTime: string; 
  endDateTime: string; 
  description?: string; 
}) => {
  return await calendarTools.createGoogleCalendarEvent(title, startDateTime, endDateTime, description);
};

const get_outlook_calendar_events = async ({ timeRange = 'week' }: { timeRange?: 'today' | 'week' | 'month' | 'six_months' } = {}) => {
  const today = new Date();
  let timeMax: string;
  
  switch (timeRange) {
    case 'today':
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      timeMax = tomorrow.toISOString();
      break;
    case 'week':
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      timeMax = nextWeek.toISOString();
      break;
    case 'six_months':
      const sixMonthsLater = new Date(today);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      timeMax = sixMonthsLater.toISOString();
      break;
    default:
      const defaultWeek = new Date(today);
      defaultWeek.setDate(defaultWeek.getDate() + 7);
      timeMax = defaultWeek.toISOString();
  }
  
  return await calendarTools.getOutlookCalendarEvents(today.toISOString(), timeMax);
};

const create_outlook_calendar_event = async ({ 
  title, 
  startDateTime, 
  endDateTime, 
  description 
}: { 
  title: string; 
  startDateTime: string; 
  endDateTime: string; 
  description?: string; 
}) => {
  return await calendarTools.createOutlookCalendarEvent(title, startDateTime, endDateTime, description);
};

// Authentication check tools
const check_google_auth = async () => {
  const isAuth = await authManager.isGoogleAuthenticated();
  return isAuth ? "User is authenticated with Google" : "User is not authenticated with Google";
};

const check_microsoft_auth = async () => {
  const isAuth = await authManager.isMicrosoftAuthenticated();
  return isAuth ? "User is authenticated with Microsoft" : "User is not authenticated with Microsoft";
};

const tools = {
  get_battery_level,
  change_brightness,
  flash_screen,
  send_gmail,
  create_gmail_draft,
  get_gmail_messages,
  send_outlook_email,
  create_outlook_draft,
  get_outlook_messages,
  get_google_calendar_events,
  create_google_calendar_event,
  get_outlook_calendar_events,
  create_outlook_calendar_event,
  check_google_auth,
  check_microsoft_auth,
};

export default tools;