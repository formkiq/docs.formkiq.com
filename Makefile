default : 
	rm -r -f build
	npm install
	npm run clean-api-docs formkiq ; npm run gen-api-docs formkiq ; npm run build

deploy : default
	  aws s3 sync build/site s3://${S3_BUCKET}/docs2
	  # aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --path "/*"
