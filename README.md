## Task-manager
This is just the back-end for a task manager application.

## Installation

You can use this on the server side, just run the following command to install dependencies after you must have cloned the repo.

~~~
npm install 
~~~


## Getting Started

To get you application working, create a `dot.env` file in the `config` folder and paste the below configuration in the file with you custom values.

~~~
PORT=your-port 
MONGODB_URL="mongodb://127.0.0.1:27017/database-Name"
JWT_SECRET=your-random-jwt-secret-key
HASH_ALGORITHM=jwt-hash-algorithm
SECRET_OR_KEY=your-secret-key-for-the-application
SECRET_OR_MAILER_KEY=mailer-secret-key
MAIL_APP_EMAIL=your-email-address
MAIL_APP_PASSWORD=your-above-email-password
~~~

## Mailer Note

To be able to send mail via gmail, be sure to set `less secure` on the gmail account provided above.
