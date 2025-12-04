import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# -------- Settings --------
DATA_DIR = "dataset"
IMG_SIZE = (224, 224)
BATCH_SIZE = 8
EPOCHS = 5  # for demo (can increase later)

# -------- Data pipeline --------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=10,
    width_shift_range=0.05,
    height_shift_range=0.05,
    shear_range=0.05,
    zoom_range=0.1,
    horizontal_flip=True,
)

train_ds = train_datagen.flow_from_directory(
    DATA_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    subset="training",
    class_mode="categorical"
)
val_ds = train_datagen.flow_from_directory(
    DATA_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    subset="validation",
    class_mode="categorical"
)

num_classes = len(train_ds.class_indices)
print("✅ Class mapping:", train_ds.class_indices)

# -------- Simple CNN model --------
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(128, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# -------- Train --------
history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

# -------- Save model --------
os.makedirs("model", exist_ok=True)
model.save("model/crop_model.h5")
print("✅ Model trained and saved successfully to model/crop_model.h5")