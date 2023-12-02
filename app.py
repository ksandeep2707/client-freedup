import os
import hashlib
from datetime import datetime
from flask import Flask, render_template, request ,jsonify

app = Flask(__name__,static_url_path='/static')

# Set the upload folder configuration
app.config['UPLOAD_FOLDER'] = 'uploads'

def get_duplicate_files(file_list):
    # Dictionary to store file hashes
    file_hashes = {}

    # List to store duplicate file paths
    duplicate_file_paths = []

    # Traverse through the file list and calculate file hashes
    for file in file_list:
    #     file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        # Calculate file hash using SHA256 algorithm
        with open(file, 'rb') as f:
                file_hash = hashlib.sha256(f.read()).hexdigest()

        # Check if the file hash already exists in the dictionary
        creation_date = datetime.fromtimestamp(os.path.getctime(file)).strftime("%a, %d %b %Y")

        # Check if the file hash already exists in the dictionary
        if file_hash in file_hashes:
            duplicate_file_paths.append((file.replace("upload_folder\\", ""), file_hashes[file_hash].replace("upload_folder\\", ""), creation_date))
        else:
            file_hashes[file_hash] = file

    return duplicate_file_paths

@app.route('/duplicate',methods=['POST'])
def get_duplicates():
    file_list = []
    duplicate_file_paths = []

    # Check if files were uploaded
    if request.files:
        for file in request.files.getlist('files'):
            file_path = os.path.join('upload_folder', file.filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            file.save(file_path)
            file_list.append(file_path)

        # Get the list of duplicate file paths
        duplicate_file_paths = get_duplicate_files(file_list)

    return jsonify(duplicates=duplicate_file_paths)

@app.route('/', methods=['GET'])
def index():
        return render_template('index.html')


@app.route('/delete_file', methods=['DELETE'])
def delete_file():
    file_path=request.form.get('file_path')
    try:
            os.remove(file_path)
            return f"The file '{file_path}' has been deleted successfully."
    except Exception as e:
        return f"An error occurred while deleting the file: {str(e)}"



if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
