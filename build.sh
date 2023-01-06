set -ue

npm --prefix=frontend run build
rm -rf docs
mv frontend/build frontend/docs
mv frontend/docs .