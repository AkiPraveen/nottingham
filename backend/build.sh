# install pip dependencies
pip3 install -r requirements.txt

echo ------------------------------------

echo 'flask version:'
which flask

echo ------------------------------------

# apply all required migrations to the database
python3 -m flask db upgrade
