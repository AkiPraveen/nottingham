import app

@app.route('/')
def home():
    return 'OK', 200

