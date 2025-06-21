default : 
	rm -r -f build
	npm install
	npm run clean-api-docs formkiq ; npm run gen-api-docs formkiq ; npm run build

deploy : default
	aws s3 sync build s3://${S3_BUCKET}/docs --delete
	./redirect-upload.sh ${S3_BUCKET}
	aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --path "/*"
