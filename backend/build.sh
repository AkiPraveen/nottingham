# install pip dependencies
pip install -r requirements.txt

echo done

# apply all required migrations to the database
python -m flask db upgrade
