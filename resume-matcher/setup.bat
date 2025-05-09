@echo off
echo Setting up Resume Matcher...

:: Step 1: Navigate to server and install dependencies
cd server
echo Installing server dependencies...
call npm install

:: Start server in new terminal window
start cmd /k "node index.js"

:: Step 2: Navigate back and go to client folder
cd ..
cd client
echo Installing client dependencies...
call npm install

:: Start client (React app) in new terminal
start cmd /k "npm start"

:: Step 3: Open localhost:3000 in Google Chrome
timeout /t 5 > nul
start chrome http://localhost:3000

echo Setup complete. The app should now be running in your browser.
pause
