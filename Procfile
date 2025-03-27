web: gunicorn backend.wsgi --chdir backend
worker: celery -A backend worker --loglevel=info
daphne: daphne -b 0.0.0.0 -p $PORT backend.asgi:application --chdir backend