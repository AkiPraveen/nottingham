# install pip dependencies
pip3 install -r requirements.txt

which flask

# apply all required migrations to the database
python3 -m flask db upgrade
