# install pip dependencies
source nottingham/bin/activate

echo done

# apply all required migrations to the database
python -m flask db upgrade
