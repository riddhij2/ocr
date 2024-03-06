from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from PIL import Image
import pytesseract
import re

import os
from flask import session
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Generate a secure random key using os.urandom
secret_key = os.urandom(24)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Summer$169@localhost/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secret_key
app.config['UPLOAD_FOLDER'] = ''  # Folder to store uploaded images
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)

# Path to the Tesseract executable (update this path based on your installation)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

class ProcessedImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    bold_words = db.Column(db.Text)
    image = db.Column(db.String(255), nullable=False)

def extract_text_from_image(img):
    # Use pytesseract to do OCR on the image
    text = pytesseract.image_to_string(img)
    return text

def extract_bold_words(text):
    # Use regular expression to identify and isolate bold words
    bold_pattern = r'\*\*(.*?)\*\*'
    bold_words = re.findall(bold_pattern, text)
    return bold_words

def get_user_id():
    # Assuming you store the user ID in the session during login
    # return session.get('user_id', None)
    return 1 

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(username=data['username']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    try:
        # Open the image file
        img = Image.open(image_file)

        # Extract text from the image
        result_text = extract_text_from_image(img)

        # Extract bold words from the text
        bold_words = extract_bold_words(result_text)

        # Save the image to the uploads folder
        img_path = save_image(image_file)

        # Save the data to the database
        user_id = get_user_id()  # This should be called within a Flask request context
        processed_image = ProcessedImage(user_id=user_id, text=result_text, bold_words=' '.join(bold_words), image=img_path)
        db.session.add(processed_image)
        db.session.commit()

        return jsonify({'text': result_text, 'bold_words': bold_words, 'image_path': img_path})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def save_image(image_file):
    # Generate a unique filename for the image
    filename = str(uuid.uuid4()) + '_' + secure_filename(image_file.filename)
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # Save the image to the uploads folder
    image_file.save(img_path)

    return img_path

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)