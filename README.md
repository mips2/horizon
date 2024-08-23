Event Horizon event manager, currently deployed separately as backend and frontend.

BACKEND DEPLOY:
Using render, build instructions involve forcing root directory to ./backend, build command: pip install -r requirements.txt, gunicorn app:app

FRONTEND DEPLOY:
Using netlify, base directory frontend, build command npm run build, publish directory build
