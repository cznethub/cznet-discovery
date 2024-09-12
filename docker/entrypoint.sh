#!/bin/sh

ROOT_DIR=/app

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/app.*.js* $ROOT_DIR/index.html;
do
  echo "Processing $file ...";

  sed -i 's|VUE_APP_NAME_PLACEHOLDER|'${VUE_APP_NAME}'|g' $file 
  sed -i 's|VUE_APP_GOOGLE_MAPS_API_KEY_PLACEHOLDER|'${VUE_APP_GOOGLE_MAPS_API_KEY}'|g' $file 
  sed -i 's|VUE_APP_API_URL_PLACEHOLDER|'${VUE_APP_API_URL}'|g' $file 
  sed -i 's|VUE_APP_DSP_URL_PLACEHOLDER|'${VUE_APP_DSP_URL}'|g' $file 
  sed -i 's|VUE_APP_VERSION_PLACEHOLDER|'${VUE_APP_VERSION}'|g' $file 

done

echo "Starting Nginx"
exec "$@"