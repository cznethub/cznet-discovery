#!/bin/sh

ROOT_DIR=/app

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
for file in $ROOT_DIR/assets/index*.js $ROOT_DIR/index.html;
do
  echo "Processing $file ...";
  echo "${VITE_APP_NAME}"
  echo "${VITE_APP_GOOGLE_MAPS_API_KEY}"
  echo "${VITE_APP_API_URL}"
  echo "${VITE_APP_DSP_URL}"
  echo "${VITE_APP_HEAP_ANALYTICS_APP_ID}"
  
  sed -i 's|VITE_APP_NAME_PLACEHOLDER|'${VITE_APP_NAME}'|g' $file 
  sed -i 's|VITE_APP_GOOGLE_MAPS_API_KEY_PLACEHOLDER|'${VITE_APP_GOOGLE_MAPS_API_KEY}'|g' $file 
  sed -i 's|VITE_APP_API_URL_PLACEHOLDER|'${VITE_APP_API_URL}'|g' $file 
  sed -i 's|VITE_APP_DSP_URL_PLACEHOLDER|'${VITE_APP_DSP_URL}'|g' $file 
  sed -i 's|VITE_APP_HEAP_ANALYTICS_APP_ID_PLACEHOLDER|'${VITE_APP_HEAP_ANALYTICS_APP_ID}'|g' $file 
done

echo "Starting Nginx"
exec "$@"