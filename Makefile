default : 
	  rm -r -f build
	  mkdir -p build
	  cd ui-bundle && zip -r ../build/ui-bundle.zip *
	  npx antora antora-playbook.yml
	  ls -l build/site/docs

deploy : default
	  aws s3 sync build/site s3://${S3_BUCKET}/docs
	  aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --path "/*"
