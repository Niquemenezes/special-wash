#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
export FLASK_DEBUG=1
export DATABASE_URL=${DATABASE_URL:-sqlite:///local.db}
pip -q install -r requirements.txt
flask --app backend.app:create_app db upgrade
flask --app backend.app:create_app run --host=0.0.0.0 --port=5000
