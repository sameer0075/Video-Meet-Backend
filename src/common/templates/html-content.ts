export function emailContent(data) {
  const content = `<!DOCTYPE html>
    <html>
      <head>
        <title>OTP Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            padding: 20px;
            margin: 0;
          }
    
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
    
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
    
          .content {
            margin-bottom: 20px;
          }
    
          .footer {
            text-align: center;
            color: #888888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>OTP Email</h2>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Your OTP code is: <strong> ${data.otp}</strong></p>
            <p>Please use this code to proceed with your sign up request.</p>
          </div>
          <div class="footer">
            <p>This email was sent automatically. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return content;
}

export function eventContent(data) {
  const today = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const reminderDate = `${new Date(data.reminder_date).getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  return `<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification Reminder</title>
  </head>
  <body>
    <div style="background-color:#f2f2f2; padding:20px;">
      <h1 style="text-align:center;">Greetings ${data.name}</h1>
      <p style="font-size:16px; text-align:center;">Here is your ${data.title} reminder set for ${reminderDate}</p>
      <p style="font-size:16px; text-align:center;">${data.description}</p>
      <hr style="border:0; border-top:1px solid #ccc;">
      <p style="font-size:14px; text-align:center; color:#999;">${today}</p>
    </div>
  </body>
</html>`;
}
