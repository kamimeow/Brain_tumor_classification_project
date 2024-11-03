import cv2
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Загрузка обученной модели
model = load_model('sec_EfficientNetB3.h5')

image_size = 160
class_names = ['glioma_tumor', 'meningioma_tumor', 'no_tumor', 'pituitary_tumor']


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    # Проверка, является ли файл изображением
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        img = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Переводим изображение в формат RGB
        img = cv2.resize(img, (image_size, image_size))
        img = np.reshape(img, (1, image_size, image_size, 3))  # добавление размерности батча
        prediction = model.predict(img)
        predicted_class_index = np.argmax(prediction)
        predicted_class_name = class_names[predicted_class_index]

        return jsonify({'predicted_class': predicted_class_name})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

