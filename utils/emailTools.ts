import { AuthManager } from './auth';
import type { EmailMessage } from '../types/auth';

export class EmailTools {
  private authManager = AuthManager.getInstance();

  // Gmail API calls
  async sendGmailEmail(to: string, subject: string, body: string): Promise<string> {
    try {
      const tokens = await this.authManager.getGoogleTokens();
      console.log("tokens", tokens.access_token);
      if (!tokens) {
        return 'Error: Not authenticated with Google. Please authenticate first.';
      }

      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        body
      ].join('\n');

      const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail
        }),
      });

      if (!response.ok) {
        // Token expired, try to refresh
        const newToken = await this.authManager.refreshGoogleToken();
        if (newToken) {
          return this.sendGmailEmail(to, subject, body);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Email sent successfully to ${to}`;
      } else {
        const error = await response.text();
        return `Error sending email: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async createGmailDraft(to: string, subject: string, body: string): Promise<string> {
    try {
      const tokens = await this.authManager.getGoogleTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Google. Please authenticate first.';
      }

      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        body
      ].join('\n');

      const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            raw: encodedEmail
          }
        }),
      });

      if (response.status === 401) {
        const newToken = await this.authManager.refreshGoogleToken();
        if (newToken) {
          return this.createGmailDraft(to, subject, body);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Draft created successfully for ${to}`;
      } else {
        const error = await response.text();
        return `Error creating draft: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async getGmailMessages(maxResults: number = 10): Promise<string> {
    try {
      const tokens = await this.authManager.getGoogleTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Google. Please authenticate first.';
      }

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshGoogleToken();
        if (newToken) {
          return this.getGmailMessages(maxResults);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Get details for first few messages
          const messagePromises = data.messages.slice(0, 5).map((msg: any) =>
            this.getGmailMessageDetails(msg.id, tokens.access_token)
          );
          
          const messages = await Promise.all(messagePromises);
          const formattedMessages = messages.map((msg, index) => 
            `${index + 1}. From: ${msg.from}, Subject: ${msg.subject}, Date: ${msg.date}`
          ).join('\n');
          
          return `Recent emails:\n${formattedMessages}`;
        } else {
          return 'No recent emails found.';
        }
      } else {
        const error = await response.text();
        return `Error fetching emails: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  private async getGmailMessageDetails(messageId: string, accessToken: string) {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    const headers = data.payload.headers;
    
    return {
      from: headers.find((h: any) => h.name === 'From')?.value || 'Unknown',
      subject: headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject',
      date: headers.find((h: any) => h.name === 'Date')?.value || 'Unknown Date'
    };
  }

  // Outlook API calls
  async sendOutlookEmail(to: string, subject: string, body: string): Promise<string> {
    try {
      const tokens = await this.authManager.getMicrosoftTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Microsoft. Please authenticate first.';
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            subject: subject,
            body: {
              contentType: 'Text',
              content: body
            },
            toRecipients: [
              {
                emailAddress: {
                  address: to
                }
              }
            ]
          }
        }),
      });

      if (response.status === 401) {
        const newToken = await this.authManager.refreshMicrosoftToken();
        if (newToken) {
          return this.sendOutlookEmail(to, subject, body);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Email sent successfully via Outlook to ${to}`;
      } else {
        const error = await response.text();
        return `Error sending Outlook email: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async createOutlookDraft(to: string, subject: string, body: string): Promise<string> {
    try {
      const tokens = await this.authManager.getMicrosoftTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Microsoft. Please authenticate first.';
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject,
          body: {
            contentType: 'Text',
            content: body
          },
          toRecipients: [
            {
              emailAddress: {
                address: to
              }
            }
          ]
        }),
      });

      if (response.status === 401) {
        const newToken = await this.authManager.refreshMicrosoftToken();
        if (newToken) {
          return this.createOutlookDraft(to, subject, body);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        return `Draft created successfully in Outlook for ${to}`;
      } else {
        const error = await response.text();
        return `Error creating Outlook draft: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async getOutlookMessages(maxResults: number = 10): Promise<string> {
    try {
      const tokens = await this.authManager.getMicrosoftTokens();
      if (!tokens) {
        return 'Error: Not authenticated with Microsoft. Please authenticate first.';
      }

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/messages?$top=${maxResults}&$select=from,subject,receivedDateTime`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        }
      );

      if (response.status === 401) {
        const newToken = await this.authManager.refreshMicrosoftToken();
        if (newToken) {
          return this.getOutlookMessages(maxResults);
        }
        return 'Error: Authentication expired. Please re-authenticate.';
      }

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const formattedMessages = data.value.map((msg: any, index: number) => 
            `${index + 1}. From: ${msg.from?.emailAddress?.address || 'Unknown'}, Subject: ${msg.subject || 'No Subject'}, Date: ${new Date(msg.receivedDateTime).toLocaleDateString()}`
          ).join('\n');
          
          return `Recent Outlook emails:\n${formattedMessages}`;
        } else {
          return 'No recent Outlook emails found.';
        }
      } else {
        const error = await response.text();
        return `Error fetching Outlook emails: ${error}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }
}