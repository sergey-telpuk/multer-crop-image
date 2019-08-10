### Storage FTP | AWS
TYPE_STORAGE=AWS

# FTP storage(only for testing)
FTP_STORAGE_BASE_PATH=/app
FTP_STORAGE_HOST=storage-ftp
FTP_STORAGE_SECURE=false
FTP_STORAGE_USER=app
FTP_STORAGE_PASSWORD=secret

##### AWS storage
##init bucket
# aws --endpoint-url=http://localhost:4572 s3 mb s3://avatar-bucket
# aws --endpoint-url=http://localhost:4572 s3api put-bucket-acl --bucket avatar-bucket --acl public-read
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://aws-s3:4572
AWS_BUCKET=avatar-bucket
AWS_ACL=public-read
AWS_S3_FORCE_PATH_STYLE=true
AWS_S3_BUCKET_ENDPOINT=true

### AVATAR_URL
#http://avatar-bucket.localhost:4572/avatar-bucket(for testing)
